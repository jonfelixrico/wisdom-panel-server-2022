import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import {
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPICurrentUserGuildsResult,
  Routes,
} from 'discord-api-types/v10'
import { keyBy } from 'lodash'
import { DISCORD_API_CACHE } from 'src/discord-api/providers/discord-api-cache.provider'
import { SessionUserClient } from 'src/discord-api/utils/api-client.util'
import { BotServersCacheService } from '../bot-servers-cache/bot-servers-cache.service'

@Injectable()
export class ServerApiService {
  constructor(
    private servers: BotServersCacheService,
    @Inject(DISCORD_API_CACHE) private cache: Cache,
  ) {}

  async getServer(
    serverId: string,
  ): Promise<RESTAPIPartialCurrentUserGuild | null> {
    const servers = await this.servers.getServers()
    return servers[serverId] ?? null
  }

  async getBotServers(): Promise<
    Record<string, RESTAPIPartialCurrentUserGuild>
  > {
    return await this.servers.getServers()
  }

  async getUserServers(
    client: SessionUserClient,
  ): Promise<Record<string, RESTAPIPartialCurrentUserGuild>> {
    const url = Routes.userGuilds()
    return this.cache.wrap(`${client.userId}:${url}`, async () => {
      const { data } = await client.get<RESTGetAPICurrentUserGuildsResult>(url)
      return keyBy(data, (server) => server.id)
    })
  }
}
