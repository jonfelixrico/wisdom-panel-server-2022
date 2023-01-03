import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { RouteBases } from 'discord-api-types/v10'

import { Axios } from 'axios'

export class DiscordBotApiClient extends Axios {}

export function provideDiscordBotApiClient(): Provider {
  return {
    provide: DiscordBotApiClient,
    useFactory(cfg: ConfigService) {
      return axios.create({
        baseURL: RouteBases.api,
        headers: {
          Authorization: `Bot ${cfg.getOrThrow('DISCORD_BOT_TOKEN')}`,
        },
      })
    },
    inject: [ConfigService],
  }
}
