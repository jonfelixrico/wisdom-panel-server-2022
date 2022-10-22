import { Controller, Get, Param } from '@nestjs/common'
import { AxiosInstance } from 'axios'
import {
  RESTGetAPIGuildMembersResult,
  RESTGetAPIGuildResult,
  Routes,
} from 'discord-api-types/v10'
import { DiscordApi } from 'src/param-decorators/discord-api.decorator'

@Controller('discord/server/:serverId')
export class ServerController {
  @Get()
  async getServer(@DiscordApi() api: AxiosInstance, @Param() serverId: string) {
    const { data } = await api.get<RESTGetAPIGuildResult>(
      Routes.guild(serverId),
    )
    return data
  }

  @Get('member')
  async listServerMembers(
    @DiscordApi() api: AxiosInstance,
    @Param() serverId: string,
  ) {
    const { data } = await api.get<RESTGetAPIGuildMembersResult>(
      Routes.guildMembers(serverId),
    )
    return data
  }
}
