import { Logger } from '@nestjs/common'
import { nanoid } from 'nanoid'

export interface RunOptions {
  throwIfSkipped?: boolean
}

export class SkippedRunError extends Error {
  constructor(id: string) {
    super(`Job [${id}] is already running.`)
  }
}

/*
 * This util is intended to handle the scenario where you want an async method to only have a single
 * running instance at any given time.
 *
 * For example: say you have an async method `foo` which takes 5 seconds to complete.
 *
 * With the usual javascript, if you called `foo` 5 times every 1 second interval, there will be
 * 5 running instances of `foo` within that 5-second interval.
 *
 * If you only want `foo` have only 1 active invocation despite being called 5 times in that time period,
 * you basically just want to return the same promise used in the first call to all other calls.
 * Only one instance is running.
 * All 5 calls will finish at the same time if awaited since they're technically the same promise.
 *
 */
export class PromiseCache {
  private cache: Record<string, Promise<unknown>> = {}
  private readonly LOGGER: Logger

  constructor(name?: string) {
    name = name ?? nanoid(5)
    this.LOGGER = new Logger(`${PromiseCache.name}:${name}`)
  }

  private getCached<T>(key: string): Promise<T> {
    return this.cache[key] as Promise<T>
  }

  run<T>(
    key: string,
    asyncFn: () => Promise<T>,
    options?: RunOptions,
  ): Promise<T> {
    const { LOGGER } = this

    const cached = this.getCached<T>(key)
    if (cached) {
      LOGGER.debug(`${key}: promise already running.`)
      if (options?.throwIfSkipped) {
        throw new SkippedRunError(key)
      }

      return cached
    }

    /*
     * We want the function to run asynchronously for now so that
     * we can cache it.
     */
    const fnPromise = asyncFn()
    LOGGER.debug(`${key}: started running an instance.`)
    this.cache[key] = fnPromise

    /*
     * We're doing this because we don't want the promise to be immortal --
     * we just want the promise to be cached for the duration that it's running.
     */
    fnPromise.finally(() => {
      if (this.cache[key] === fnPromise) {
        LOGGER.debug(`${key}: finished running.`)
        delete this.cache[key]
      } else if (!this.cache[key]) {
        LOGGER.warn(
          `${key}: finished running but cache entry seems to be empty.`,
        )
      } else {
        LOGGER.warn(`${key}: finished running but mismatch detected in cache.`)
      }
    })

    /*
     * The promise returned to the user should have a very similar "experience" to, say,
     * if one calls asyncFn() directly.
     */
    return fnPromise
  }
}
