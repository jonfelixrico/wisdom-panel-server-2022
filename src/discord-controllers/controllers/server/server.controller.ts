import { Controller, Get } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { orderBy } from 'lodash'
import { SessionUserDiscordApi } from 'src/discord-api/decorators/session-user-discord-api.decorator'
import { ServerApiService } from 'src/discord-api/services/server-api/server-api.service'
import { SessionUserClient } from 'src/discord-api/utils/api-client.util'
import { getServerIconUrl } from 'src/discord-controllers/utils/image.util'
import { ServerDto } from './server.dto'

@Controller('server')
@ApiTags('discord')
export class ServerController {
  constructor(private serverApi: ServerApiService) {}

  @ApiOperation({
    operationId: 'getServers',
    summary:
      'Get the list of servers accessible to both the bot and the session user.',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      type: 'object',
      additionalProperties: {
        $ref: getSchemaPath(ServerDto),
      },
    },
  })
  @Get()
  async getServers(
    @SessionUserDiscordApi() client: SessionUserClient,
  ): Promise<ServerDto[]> {
    const [botServers, userServers] = await Promise.all([
      this.serverApi.getBotServers(),
      this.serverApi.getUserServers(client),
    ])

    const items: ServerDto[] = []
    /*
     * The intention of this entire loop is to only keep the servers which
     * both the bot and the server has joined (intersection).
     */
    for (const serverId in userServers) {
      if (!botServers[serverId]) {
        continue
      }

      const server = userServers[serverId]
      items.push({
        iconUrl: getServerIconUrl(server),
        id: serverId,
        name: server.name,
      })
    }

    // This sorting was only necessary to keep the ordering predictable
    return orderBy(items, (i) => i.id)
  }
}
