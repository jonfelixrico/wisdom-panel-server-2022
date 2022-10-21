import { Controller, Get } from '@nestjs/common'
import { DiscordRest } from 'src/param-decorators/discord-rest.decorator'
import { RESTGetAPICurrentUserResult, Routes } from 'discord-api-types/v10'
import { AxiosInstance } from 'axios'

@Controller('discord/user')
export class UserController {
  @Get('/@me')
  async getSessionUserData(@DiscordRest() client: AxiosInstance) {
    const { data } = await client.get<RESTGetAPICurrentUserResult>(
      Routes.user(),
    )

    return data
  }
}
