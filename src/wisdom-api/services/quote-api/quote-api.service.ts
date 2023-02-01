import { HttpStatus, Injectable } from '@nestjs/common'
import { isAxiosError } from 'axios'
import { WisdomAPIQuote } from 'src/wisdom-api/dto/quote.wisdom-dto'
import { WisdomApiClient } from 'src/wisdom-api/providers/wisdom-api-client.provider'
import { plainToInstance } from 'class-transformer'
import { QuoteTransformer } from './quote-transformer.class'

@Injectable()
export class QuoteApiService {
  constructor(private api: WisdomApiClient) {}

  async getQuote(serverId: string, quoteId: string): Promise<WisdomAPIQuote> {
    try {
      const { data } = await this.api.get<WisdomAPIQuote>(
        `v2/server/${serverId}/quote/${quoteId}`,
      )

      return plainToInstance(QuoteTransformer, data)
    } catch (e) {
      if (isAxiosError(e) && e.status === HttpStatus.NOT_FOUND) {
        return null
      }

      throw e
    }
  }

  async listQuotes(serverId: string): Promise<WisdomAPIQuote[]> {
    const { data } = await this.api.get<WisdomAPIQuote[]>(
      `v2/server/${serverId}/quote`,
    )

    return plainToInstance(QuoteTransformer, data)
  }
}
