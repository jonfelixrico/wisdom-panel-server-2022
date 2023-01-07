import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { RouteBases } from 'discord-api-types/v10'

import { Axios } from 'axios'
import { isDiscordError } from '../utils/api-client.util'

export class DiscordBotApiClient extends Axios {}

export function provideDiscordBotApiClient(): Provider {
  return {
    provide: DiscordBotApiClient,
    useFactory(cfg: ConfigService) {
      const instance = axios.create({
        baseURL: RouteBases.api,
        headers: {
          Authorization: `Bot ${cfg.getOrThrow('DISCORD_BOT_TOKEN')}`,
        },
      })

      instance.interceptors.response.use(
        (res) => res,
        (err) => {
          if (isDiscordError(err)) {
            const { data } = err.response
            err.message = `${data.message ?? err.message} (${data.code})`
          }

          return Promise.reject(err)
        },
      )

      return instance
    },
    inject: [ConfigService],
  }
}
