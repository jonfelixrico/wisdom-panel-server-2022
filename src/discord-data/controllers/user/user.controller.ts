import { Controller, Get } from '@nestjs/common'
import { DiscordApi } from 'src/param-decorators/discord-api.decorator'
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
  Routes,
} from 'discord-api-types/v10'
import { AxiosInstance } from 'axios'

@Controller('discord/user')
export class UserController {
  @Get('/@me')
  async getSessionUserData(@DiscordApi() api: AxiosInstance) {
    const { data } = await api.get<RESTGetAPICurrentUserResult>(Routes.user())

    return data
  }

  @Get('/@me/server')
  async getSessionUserServers(@DiscordApi() api: AxiosInstance) {
    const { data } = await api.get<RESTGetAPICurrentUserGuildsResult>(
      Routes.userGuilds(),
    )

    return data
  }
}
