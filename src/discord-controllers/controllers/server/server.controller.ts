import { Controller, Get } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { SessionUserDiscordApi } from 'src/discord-api/decorators/session-user-discord-api.decorator'
import { ServerApiService } from 'src/discord-api/services/server-api/server-api.service'
import { SessionUserClient } from 'src/discord-api/utils/api-client.util'
import { getServerIconUrl } from 'src/discord-controllers/utils/image.util'
import { ServerDto } from './server.dto'

@Controller('server')
@ApiExtraModels(ServerDto)
export class ServerController {
  constructor(private serverApi: ServerApiService) {}

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
  ): Promise<Record<string, ServerDto>> {
    const [botServers, userServers] = await Promise.all([
      this.serverApi.getBotServers(),
      this.serverApi.getUserServers(client),
    ])

    const items: Record<string, ServerDto> = {}
    for (const serverId in userServers) {
      if (!botServers[serverId]) {
        continue
      }

      const server = userServers[serverId]
      items[serverId] = {
        iconUrl: getServerIconUrl(server),
        id: serverId,
        name: server.name,
      }
    }

    return items
  }
}
