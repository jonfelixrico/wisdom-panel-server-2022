import {
  WisdomAPIQuote,
  WisdomAPIQuoteReceive,
} from 'src/wisdom-api/dto/quote.wisdom-dto'

export class QuoteReceiveDto implements WisdomAPIQuoteReceive {
  id: string
  userId: string
}

export class QuoteDto implements WisdomAPIQuote {
  id: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date

  receives: QuoteReceiveDto[]
}
