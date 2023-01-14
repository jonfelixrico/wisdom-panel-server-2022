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

  private getCached<T>(key: string): Promise<T> {
    return this.cache[key] as Promise<T>
  }

  run<T>(key: string, asyncFn: () => Promise<T>): Promise<T> {
    const cached = this.getCached<T>(key)
    if (cached) {
      return cached
    }

    /*
     * We want the function to run asynchronously for now so that
     * we can cache it.
     */
    const fnPromise = asyncFn()
    this.cache[key] = fnPromise

    /*
     * We're doing this because we don't want the promise to be immortal --
     * we just want the promise to be cached for the duration that it's running.
     */
    fnPromise.finally(() => {
      if (this.cache[key] === fnPromise) {
        delete this.cache[key]
      }
    })

    /*
     * The promise returned to the user should have a very similar "experience" to, say,
     * if one calls asyncFn() directly.
     */
    return fnPromise
  }
}
