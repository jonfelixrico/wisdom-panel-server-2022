import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { DiscordBotApiClient } from './discord-bot-api-client.class'
import { RouteBases } from 'discord-api-types/v10'

export const DISCORD_BOT_API_PROVIDER: Provider = {
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
