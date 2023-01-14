import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api.provider'
import { DISCORD_API_CACHE } from 'src/discord-api/providers/discord-api-cache.provider'
import { Cache } from 'cache-manager'
import {
  RESTGetAPIGuildMemberResult,
  RESTGetAPIGuildQuery,
  RESTGetAPIGuildResult,
  Routes,
} from 'discord-api-types/v10'
import {
  isDiscordError,
  SessionUserClient,
} from 'src/discord-api/utils/api-client.util'

@Injectable()
export class ServerMemberApiService {
  constructor(
    private api: DiscordBotApiClient,
    @Inject(DISCORD_API_CACHE) private cache: Cache,
  ) {}

  private async getServer(serverId: string): Promise<RESTGetAPIGuildResult> {
    const url = Routes.guild(serverId)
    return await this.cache.wrap(
      url,
      async () => {
      try {
        const { data } = await this.api.get(url, {
          params: {
            with_counts: true,
          } as RESTGetAPIGuildQuery,
        })
        return data
      } catch (e) {
        if (isDiscordError(e) && e.response.status === HttpStatus.FORBIDDEN) {
          return null
        }

        throw e
      }
      },
      /*
       * We don't expect server data to change drastically within such a time period,
       * hence the larger cache time.
       */
      5 * 60 * 1_000,
    )
  }
    })
  }

  async isBotMemberOf(serverId: string): Promise<boolean> {
    return !!(await this.getServer(serverId))
  }

  async getMember(
    serverId: string,
    userId: string,
  ): Promise<RESTGetAPIGuildMemberResult | null> {
    const url = Routes.guildMember(serverId, userId)
    return await this.cache.wrap(url, async () => {
      try {
        const { data } = await this.api.get<RESTGetAPIGuildMemberResult>(url)
        return data
      } catch (e) {
        // handle user not being a member of the server
        if (isDiscordError(e) && e.response.status === HttpStatus.NOT_FOUND) {
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
    })
  }

  async isUserMemberOf(
    client: SessionUserClient,
    serverId: string,
  ): Promise<boolean> {
    const url = Routes.userGuildMember(serverId)
    return this.cache.wrap(`${client.userId}:${url}`, async () => {
      try {
        await client.get(url)
        return true
      } catch (e) {
        if (isDiscordError(e) && e.response.status === HttpStatus.FORBIDDEN) {
          return false
        }

        throw e
      }
    })
  }
}
