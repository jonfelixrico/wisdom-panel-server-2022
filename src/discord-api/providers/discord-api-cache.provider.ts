import { Provider } from '@nestjs/common'
import { caching, Cache } from 'cache-manager'
import { PromiseCache } from 'src/utils/promise-cache.utils'

export const DISCORD_API_CACHE = Symbol('discord api cache')

export interface ApiCache extends Cache {
  /**
   * Similar to `wrap`, but this makes sure that there is only one instance of the wrapped
   * function running at any given time within the Cache context.
   */
  wrapV2: Cache['wrap']
}

export function provideDiscordApiCache(): Provider {
  return {
    provide: DISCORD_API_CACHE,
    inject: [PromiseCache],
    useFactory: async (promiseCache: PromiseCache) => {
      const dataCache = await caching('memory', {
        max: 100,
        ttl: 60 * 1000,
      })

      const wrapV2: Cache['wrap'] = (key, fn, ttl) => {
        const promiseCached = () => promiseCache.run(key, fn)
        return dataCache.wrap(key, promiseCached, ttl)
      }

      Object.assign(dataCache, {
        wrapV2,
      })

      return dataCache
    },
  }
}
