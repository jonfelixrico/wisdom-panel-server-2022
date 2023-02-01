import {
  WisdomAPIQuote,
  WisdomAPIQuoteReceive,
  WisdomAPIStatusDeclaration,
} from 'src/wisdom-api/dto/quote.wisdom-dto'
import { WisdomRESTListQuotesQuery } from 'src/wisdom-api/services/quote-api/quote-api.service'

export class QuoteReceive implements WisdomAPIQuoteReceive {
  timestamp: Date
  serverId: string
  channelId: string
  messageId: string
  isLegacy: boolean
  id: string
  userId: string
}

export class StatusDeclaration implements WisdomAPIStatusDeclaration {
  status: string
  timestamp: Date
}

export class Quote implements WisdomAPIQuote {
  expirationDt: Date
  serverId: string
  channelId: string
  messageId: string
  receives: QuoteReceive[]
  statusDeclaration: StatusDeclaration | null
  votes: Record<string, Date>
  requiredVoteCount: number
  isLegacy: boolean
  revision: number
  id: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
}

export type RESTGetQuoteResult = Quote
export type RESTListQuotesResult = Quote[]

export class RESTListQuotesQuery implements WisdomRESTListQuotesQuery {
  after?: string
  limit?: number
}
