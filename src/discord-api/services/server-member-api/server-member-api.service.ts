import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api.provider'
import { DISCORD_BOT_CACHE } from 'src/discord-api/providers/discord-bot-cache.provider'
import { Cache } from 'cache-manager'
import { RESTGetAPIGuildMemberResult, Routes } from 'discord-api-types/v10'
import { isAxiosError } from 'axios'

@Injectable()
export class ServerMemberApiService {
  constructor(
    private api: DiscordBotApiClient,
    @Inject(DISCORD_BOT_CACHE) private cache: Cache,
  ) {}

  async getMember(
    serverId: string,
    userId: string,
  ): Promise<RESTGetAPIGuildMemberResult | null> {
    return await this.cache.wrap(
      `server/${serverId}/user/${userId}`,
      async () => {
      try {
        const { data } = await this.api.get<RESTGetAPIGuildMemberResult>(
          Routes.guildMember(serverId, userId),
        )
        return data
      } catch (e) {
        // handle user not being a member of the server
        if (isAxiosError(e) && e.status === HttpStatus.NOT_FOUND) {
          return null
        }

        /*
         * TODO do the following tests to make the handling more robust
         * - try to access server that that bot does not have access to
         * - try to access a nonexistent server
         * - try to access a nonexistent user
         * - try to access a user which doesnt belong to the server
         */

        throw e
      }
      },
    )
  }
}
