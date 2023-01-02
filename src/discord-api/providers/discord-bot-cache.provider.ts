import { Provider } from '@nestjs/common'
import { caching } from 'cache-manager'

export const DISCORD_BOT_CACHE = Symbol('discord bot cache')

export function provideDiscordBotCache(): Provider {
  return {
    provide: DISCORD_BOT_CACHE,
    useFactory() {
      return caching('memory', {
        max: 100,
        ttl: 60 * 1000,
      })
    },
  }
}
