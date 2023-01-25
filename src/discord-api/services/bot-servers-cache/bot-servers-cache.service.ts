import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Promise } from 'bluebird'
import {
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPICurrentUserGuildsQuery,
  RESTGetAPICurrentUserGuildsResult,
  Routes,
} from 'discord-api-types/v10'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api.provider'
import { isDiscordRateLimitError } from 'src/discord-api/utils/api-client.util'
import { PromiseCache, SkippedRunError } from 'src/utils/promise-cache.utils'

interface DiscordServer extends RESTAPIPartialCurrentUserGuild {
  fetchDt: Date
}

/**
 * This is how many server data we want to pull per call.
 * This value is the max that Discord allows.
 */
const FETCH_LIMIT = 200

type ServerMap = Record<string, DiscordServer>

@Injectable()
export class BotServersCacheService {
  private servers: ServerMap = {}
  private lastCompletedFetch: Date

  private readonly LOGGER = new Logger(BotServersCacheService.name)

  constructor(
    private api: DiscordBotApiClient,
    private promiseCache: PromiseCache,
  ) {}

  private pushResultsIntoMap(result: RESTGetAPICurrentUserGuildsResult) {
    const fetchDt = new Date()
    for (const server of result) {
      this.servers[server.id] = {
        ...server,
        fetchDt,
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

  private async fetchServers() {
    const { LOGGER } = this

    let lastId: string
    let iterations = 0

    while (true) {
      iterations++

      try {
        const result = await this.fetchServersFromDiscordApi({
          after: lastId,
          limit: FETCH_LIMIT,
        })

        if (!result.length) {
          /*
           * This will happen if the bot has no joined servers, or if we have
           * already reached the end of the list of servers for the bot.
           *
           * This will end the fetch process sucessfully.
           */
          this.lastCompletedFetch = new Date() // this is to be done per successful fetch process
          return
        }

        this.pushResultsIntoMap(result)
        lastId = result[result.length - 1].id

        if (result.length < FETCH_LIMIT) {
          /*
           * This means that we've reached the end of the list of the servers
           * that the bot has joined to.
           *
           * This will end the fetch process sucessfully.
           */
          this.lastCompletedFetch = new Date() // this is to be done per successful fetch process
          return
        }
      } catch (e) {
        if (!isDiscordRateLimitError(e)) {
          LOGGER.error(
            `Error while fetcing servers: [${iterations}, ${lastId}] ${e.message}`,
            e.stack,
          )
          throw e
        }

        LOGGER.debug(
          `Rate limit while trying to fetch servers: [${iterations}, ${lastId}]: ${e.response.data.message}`,
        )
        await Promise.delay(e.response.data.retry_after * 1000)
      }
    }
  }

  async getServers(): Promise<ServerMap> {
    if (!this.lastCompletedFetch) {
      await this.promiseCache.run('bot-server-cache', () => this.fetchServers())
    }

    return this.servers
  }

  @Cron('*/10 * * * *')
  async runScheduledTask() {
    const { LOGGER } = this

    const toRun = async () => {
      /*
       * We want to include the logging here to make sure that these will only appear in the logs
       * if the job does get executed (the promise cache allows us)
       */

      LOGGER.log('Started cron job.')
      try {
        await this.fetchServers()
        LOGGER.log('Finished cron job without errors.')
      } catch (e) {
        LOGGER.error(`Finished cron job with errors: ${e?.message}`, e.stack)
      }
    }

    try {
      await this.promiseCache.run('bot-server-cache', toRun, {
        throwIfSkipped: true,
      })
    } catch (e) {
      if (!(e instanceof SkippedRunError)) {
        LOGGER.error(
          `Unexpected error in the cron job itself: ${e.message}`,
          e.stack,
        )
      }

      /*
       * We want to use warn since overlapping cron jobs is not a sign of normal operation.
       */
      LOGGER.warn(
        'CRON job did not run since there was an already active instance.',
      )
    }
  }
}
