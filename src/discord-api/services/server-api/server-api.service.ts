import { Injectable } from '@nestjs/common'
import { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10'
import { orderBy } from 'lodash'
import { BotServersCacheService } from '../bot-servers-cache/bot-servers-cache.service'

@Injectable()
export class ServerApiService {
  constructor(private serverCache: BotServersCacheService) {}

  async getServer(
    serverId: string,
  ): Promise<RESTAPIPartialCurrentUserGuild | null> {
    const servers = await this.serverCache.getServers()
    return servers[serverId] ?? null
  }

  async getServers(): Promise<RESTAPIPartialCurrentUserGuild[]> {
    const servers = await this.serverCache.getServers()
    return orderBy(Object.values(servers), ['name'], ['asc'])
  }
}
