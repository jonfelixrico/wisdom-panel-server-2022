import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { QuoteApiService } from 'src/wisdom-api/services/quote-api/quote-api.service'
import { QuoteDto } from 'src/wisdom-controllers/dto/quote.dto'

@ApiTags('wisdom')
@Controller('server/:serverId/quote')
export class ServerQuoteController {
  constructor(private quoteApi: QuoteApiService) {}

  @ApiOperation({
    operationId: 'getQuote',
    summary: 'Get a quote from a server',
  })
  @Get(':quoteId')
  async getQuote(
    // TODO make required
    @Param('serverId') serverId: string,
    @Param('quoteId') quoteId: string,
  ): Promise<QuoteDto> {
    const quote = await this.quoteApi.getQuote(serverId, quoteId)
    if (!quote) {
      throw new NotFoundException()
    }

    return quote
  }
}
