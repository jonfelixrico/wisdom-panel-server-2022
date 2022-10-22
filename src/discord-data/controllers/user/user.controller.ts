import { Controller, Get } from '@nestjs/common'
import { DiscordApi } from 'src/param-decorators/discord-api.decorator'
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
  Routes,
} from 'discord-api-types/v10'
import { AxiosInstance } from 'axios'
import { BotApiService } from 'src/discord-data/services/bot-api/bot-api.service'

@Controller('discord/user')
export class UserController {
  constructor(private botSvc: BotApiService) {}

  @Get('/@me')
  async getSessionUserData(@DiscordApi() api: AxiosInstance) {
    const { data } = await api.get<RESTGetAPICurrentUserResult>(Routes.user())

    return data
  }

  private async getServerIdsAccesibleByBot() {
    const servers = await this.botSvc.getServers()
    return new Set(servers.map(({ id }) => id))
  }

  @Get('/@me/server')
  async getSessionUserServers(@DiscordApi() api: AxiosInstance) {
    const { data } = await api.get<RESTGetAPICurrentUserGuildsResult>(
      Routes.userGuilds(),
    )

    const accessibleServerIds = await this.getServerIdsAccesibleByBot()
    return data.filter(({ id }) => accessibleServerIds.has(id))
  }
}
