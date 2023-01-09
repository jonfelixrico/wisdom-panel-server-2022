import { Provider } from '@nestjs/common'
import { caching } from 'cache-manager'

export const DISCORD_API_CACHE = Symbol('discord api cache')

export function provideDiscordApiCache(): Provider {
  return {
    provide: DISCORD_API_CACHE,
    useFactory: () => {
      return caching('memory', {
        max: 100,
        ttl: 60 * 1000,
      })
    },
  }
}
