import { Inject, Injectable } from '@nestjs/common'
import { DiscordBotApi } from 'src/discord-api/providers/discord-bot-api.provider'
import { DISCORD_BOT_CACHE } from 'src/discord-api/providers/discord-bot-cache.provider'
import { Cache } from 'cache-manager'
import { RESTGetAPIGuildMemberResult, Routes } from 'discord-api-types/v10'

@Injectable()
export class ServerMemberRepositoryService {
  constructor(
    private api: DiscordBotApi,
    @Inject(DISCORD_BOT_CACHE) private cache: Cache,
  ) {}

  async getMember(serverId: string, userId: string) {
    return this.cache.wrap(`server/${serverId}/user/${userId}`, async () => {
      const { data } = await this.api.get<RESTGetAPIGuildMemberResult>(
        Routes.guildMember(serverId, userId),
      )
      return data
    })
  }
}
