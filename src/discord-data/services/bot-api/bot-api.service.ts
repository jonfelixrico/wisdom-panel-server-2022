import { Injectable } from '@nestjs/common'
import {
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPIGuildMembersQuery,
  RESTGetAPIGuildMembersResult,
  Routes,
} from 'discord-api-types/v10'
import { DiscordBotApiClient } from 'src/discord-data/discord-bot-api-client.class'

const FETCH_MEMBERS_PAGINATION_SIZE = 1000

/**
 * Uses the Wisdom bot user to perform some API calls.
 * This was necessary because some routes are necessary for the user.
 */
@Injectable()
export class BotApiService {
  constructor(private api: DiscordBotApiClient) {}

  /**
   * Lists down the servers that the Wisdom bot is a mebmer of.
   * @returns
   */
  async getServers() {
    const { data } = await this.api.get<RESTGetAPICurrentUserGuildsResult>(
      Routes.userGuilds(),
    )

    return data
  }

  /**
   * Lists down the members of a server.
   * Take note that we should expect this to throw an error if we tried to access information for a server
   * that the bot is not a part of.
   *
   * @param serverId
   * @returns
   */
  async getServerMembers(serverId: string) {
    const members: RESTGetAPIGuildMembersResult = []

    while (true) {
      const after =
        members.length > 0 ? members[members.length - 1].user.id : undefined

      const { data } = await this.api.get<RESTGetAPIGuildMembersResult>(
        Routes.guildMembers(serverId),
        {
          params: {
            limit: FETCH_MEMBERS_PAGINATION_SIZE,
            after,
          } as RESTGetAPIGuildMembersQuery,
        },
      )
      members.push(...data)

      if (data.length < FETCH_MEMBERS_PAGINATION_SIZE) {
        break
      }

      // else, keep going since there might be more members
    }

    return members
  }
}
