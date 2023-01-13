import {
  WisdomApiQuoteDto,
  WisdomApiQuoteReceiveDto,
} from 'src/wisdom-api/dto/quote.wisdom-dto'

export class QuoteReceiveDto implements WisdomApiQuoteReceiveDto {
  id: string
  userId: string
}

export class QuoteDto implements WisdomApiQuoteDto {
  id: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date

  receives: QuoteReceiveDto[]
}
