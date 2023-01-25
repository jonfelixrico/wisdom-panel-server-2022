import { Injectable } from '@nestjs/common'
import { Promise } from 'bluebird'
import {
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPICurrentUserGuildsQuery,
  RESTGetAPICurrentUserGuildsResult,
  Routes,
} from 'discord-api-types/v10'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api.provider'
import { isDiscordRateLimitError } from 'src/discord-api/utils/api-client.util'

interface DiscordServer extends RESTAPIPartialCurrentUserGuild {
  fetchDt: Date
}

/**
 * This is how many server data we want to pull per call.
 * This value is the max that Discord allows.
 */
const FETCH_LIMIT = 200

@Injectable()
export class BotServersCacheService {
  private servers: Record<string, DiscordServer> = {}

  constructor(private api: DiscordBotApiClient) {}

  private pushResultsIntoMap(result: RESTGetAPICurrentUserGuildsResult) {
    const fetchDt = new Date()
    for (const server of result) {
      this.servers[server.id] = {
        ...server,
        fetchDt,
      }
    }
  }

  async fetchServers() {
    let lastId: string

    while (true) {
      try {
        const result = await this.fetchServersFromDiscordApi({
          after: lastId,
          limit: FETCH_LIMIT,
        })

        if (!result.length) {
          /*
           * This will happen if the bot has no joined servers, or if we have
           * already reached the end of the list of servers for the bot.
           */
          return
        }

        this.pushResultsIntoMap(result)
        lastId = result[result.length - 1].id

        if (result.length < FETCH_LIMIT) {
          /*
           * This means that we've reached the end of the list of the servers
           * that the bot has joined to.
           */
          return
        }
      } catch (e) {
        if (!isDiscordRateLimitError(e)) {
          throw e
        }

        await Promise.delay(e.response.data.retry_after * 1000)
      }
    }
  }

  private async fetchServersFromDiscordApi(
    params: RESTGetAPICurrentUserGuildsQuery,
  ): Promise<RESTGetAPICurrentUserGuildsResult> {
    const { data } = await this.api.get<RESTGetAPICurrentUserGuildsResult>(
      Routes.userGuilds(),
      { params },
    )
    return data
  }
}
