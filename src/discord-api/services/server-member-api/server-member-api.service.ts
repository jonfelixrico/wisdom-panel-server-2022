import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api.provider'
import {
  ApiCache,
  DISCORD_API_CACHE,
} from 'src/discord-api/providers/discord-api-cache.provider'
import {
  APIGuildMember,
  RESTGetAPIGuildMemberResult,
  RESTGetAPIGuildMembersQuery,
  RESTGetAPIGuildMembersResult,
  RESTGetAPIGuildQuery,
  RESTGetAPIGuildResult,
  Routes,
} from 'discord-api-types/v10'
import {
  isDiscordError,
  SessionUserClient,
} from 'src/discord-api/utils/api-client.util'
import { keyBy } from 'lodash'

@Injectable()
export class ServerMemberApiService {
  constructor(
    private api: DiscordBotApiClient,
    @Inject(DISCORD_API_CACHE) private cache: ApiCache,
  ) {}

  private async getServer(serverId: string): Promise<RESTGetAPIGuildResult> {
    const url = Routes.guild(serverId)
    return await this.cache.wrapV2(
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

  private async getServerMemberMap(
    serverId: string,
  ): Promise<Record<string, APIGuildMember>> {
    // WARNING: The GUILD_MEMBERS intent has to be enabled or else this method will return a 403!!

    const url = Routes.guildMembers(serverId)
    return await this.cache.wrapV2(
      url,
      async () => {
        const { data } = await this.api.get<RESTGetAPIGuildMembersResult>(url, {
          params: {
            limit: 1_000,
          } as RESTGetAPIGuildMembersQuery,
        })

        return keyBy(data, (member) => member.user.id)
      },
      2.5 * 60 * 1_000,
    )
  }

  async isBotMemberOf(serverId: string): Promise<boolean> {
    return !!(await this.getServer(serverId))
  }

  async getMember(
    serverId: string,
    userId: string,
  ): Promise<RESTGetAPIGuildMemberResult | null> {
    /*
     * This is just to check if the bot has access to that server.
     * This eliminates 403s by being thrown by the methods below.
     */
    const server = await this.getServer(serverId)
    if (!server) {
      return null
    }

    /*
     * We are going with different strategies with user-data fetching based on the server size.
     *
     * For servers with <= 1k members, we can use the list endpoint to fetch all of their members at once.
     * Since we have all of their member data in one go, we can just keep hitting the cache for future data retrieval
     * until the cache fails for any members. If we query for 10 different users in a short amount of time, we will not be rate-limited.
     *
     * For servers with > 1k members, we can't use the approach above since we'll have to perform multiple requests. Too complex
     * and we might hit the rate limit before, say, retrieving 10k members (10 requests).
     *
     * Even with caching, if we try to query for 10 different users with this individual-retrieve approach, we will be rate-limited since
     * we're still hitting the API.
     */

    if (server.approximate_member_count > 1_000) {
      return await this.getIndividualMember(serverId, userId)
    }

    const userMap = await this.getServerMemberMap(serverId)
    return userMap[userId] ?? null
  }

  private async getIndividualMember(
    serverId: string,
    userId: string,
  ): Promise<RESTGetAPIGuildMemberResult | null> {
    const url = Routes.guildMember(serverId, userId)
    return await this.cache.wrapV2(url, async () => {
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
