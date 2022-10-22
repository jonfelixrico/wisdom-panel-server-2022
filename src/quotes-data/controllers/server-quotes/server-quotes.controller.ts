import { Controller, Get, Param, Query } from '@nestjs/common'
import { HttpService } from 'nestjs-http-promise'
import { ServerQuoteDto } from './server-quotes.dtos'

@Controller('server/:serverId')
export class ServerQuotesController {
  constructor(private api: HttpService) {}

  @Get()
  async getServerQuotes(
    @Param() serverId: string,
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
