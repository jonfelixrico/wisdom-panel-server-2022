import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DiscordServerIdParam } from 'src/discord-api/decorators/discord-server-id-param.decorator'
import { DiscordServerAccessGuard } from 'src/discord-api/guards/discord-server-access.guard'
import { QuoteApiService } from 'src/wisdom-api/services/quote-api/quote-api.service'
import {
  RESTGetQuoteResult,
  RESTListQuotesQuery,
  RESTListQuotesResult,
} from 'src/wisdom-controllers/controllers/server-quote/quote.dto'

@UseGuards(DiscordServerAccessGuard)
@ApiTags('wisdom')
@Controller('server/:serverId/quote')
export class ServerQuoteController {
  constructor(private quoteApi: QuoteApiService) {}

  @ApiOperation({
    operationId: 'getQuote',
    summary: 'Get a quote from a server',
  })
  @ApiResponse({
    status: 404,
    description: 'Quote not found, or server not found.',
  })
  @DiscordServerIdParam()
  @Get(':quoteId')
  async getQuote(
    // TODO make required
    @Param('serverId') serverId: string,
    @Param('quoteId') quoteId: string,
  ): Promise<RESTGetQuoteResult> {
    const quote = await this.quoteApi.getQuote(serverId, quoteId)
    if (!quote) {
      throw new NotFoundException()
    }

    return quote
  }

  @ApiOperation({
    operationId: 'listQuote',
    summary: 'List the quotes from a server',
  })
  @DiscordServerIdParam()
  @Get()
  async listQuote(
    // TODO make required
    @Param('serverId') serverId: string,
    @Query() query: RESTListQuotesQuery,
  ): Promise<RESTListQuotesResult> {
    const quote = await this.quoteApi.listQuotes(serverId, query)
    if (!quote) {
      throw new NotFoundException()
    }

    return quote
  }
}
