import { HttpStatus, Injectable } from '@nestjs/common'
import { isAxiosError } from 'axios'
import {
  WisdomAPIQuote,
  WisdomAPIQuoteReceive,
} from 'src/wisdom-api/dto/quote.wisdom-dto'
import { WisdomApiClient } from 'src/wisdom-api/providers/wisdom-api-client.provider'
import { plainToInstance, Type } from 'class-transformer'

class QuoteCt implements WisdomAPIQuote {
  id: string
  content: string
  authorId: string
  submitterId: string

  @Type(() => Date)
  submitDt: Date
  // not yet necessary to create a CT class for the receive since it doesnt have any types which require processing
  receives: WisdomAPIQuoteReceive[]
}

@Injectable()
export class QuoteApiService {
  constructor(private api: WisdomApiClient) {}

  async getQuote(serverId: string, quoteId: string): Promise<WisdomAPIQuote> {
    try {
      const { data } = await this.api.get<WisdomAPIQuote>(
        `v2/server/${serverId}/quote/${quoteId}`,
      )

      return plainToInstance(QuoteCt, data)
    } catch (e) {
      if (isAxiosError(e) && e.status === HttpStatus.NOT_FOUND) {
        return null
      }

      throw e
    }
  }
}
