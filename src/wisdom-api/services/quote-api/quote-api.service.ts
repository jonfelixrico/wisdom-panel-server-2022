import { HttpStatus, Injectable } from '@nestjs/common'
import { isAxiosError } from 'axios'
import { WisdomApiQuoteDto } from 'src/wisdom-api/dto/quote.wisdom-dto'
import { WisdomApiClient } from 'src/wisdom-api/providers/wisdom-api-client.provider'

@Injectable()
export class QuoteApiService {
  constructor(private api: WisdomApiClient) {}

  async getQuote(serverId: string, quoteId: string) {
    try {
      const { data } = await this.api.get<WisdomApiQuoteDto>(
        `server/${serverId}/quote/${quoteId}`,
      )
      return data
    } catch (e) {
      if (isAxiosError(e) && e.status === HttpStatus.NOT_FOUND) {
        return null
      }

      throw e
    }
  }
}
