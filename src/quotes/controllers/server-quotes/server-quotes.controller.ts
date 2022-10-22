import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { HttpService } from 'nestjs-http-promise'
import { WISDOM_CORE_API_HTTP_CLIENT } from 'src/wisdom-core-api/wisdom-core-api-http-client.token'
import { ServerQuoteDto } from './server-quotes.dtos'

@Controller('server/:serverId')
export class ServerQuotesController {
  constructor(@Inject(WISDOM_CORE_API_HTTP_CLIENT) private api: HttpService) {}

  @Get('quote')
  async getServerQuotes(
    @Param('serverId') serverId: string,
    @Query('authorId') authorId: string,
  ) {
    console.debug(serverId)
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
