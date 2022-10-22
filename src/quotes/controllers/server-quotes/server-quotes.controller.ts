import { Controller, Get, Param, Query } from '@nestjs/common'
import { WisdomCoreApiClient } from 'src/wisdom-core-api/wisdom-core-api-client.class'
import { ServerQuoteDto } from './server-quotes.dtos'

@Controller('server/:serverId')
export class ServerQuotesController {
  constructor(private api: WisdomCoreApiClient) {}

  @Get('quote')
  async getServerQuotes(
    @Param('serverId') serverId: string,
    @Query('authorId') authorId: string,
  ) {
    const { data } = await this.api.get<ServerQuoteDto[]>(
      `server/${serverId}/quote`,
      {
        params: {
          authorId,
        },
      },
    )
    return data
  }
}
