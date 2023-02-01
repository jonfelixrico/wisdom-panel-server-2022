import {
  WisdomAPIQuote,
  WisdomAPIQuoteReceive,
  WisdomAPIStatusDeclaration,
} from 'src/wisdom-api/dto/quote.wisdom-dto'

class QuoteReceiveTransformer implements WisdomAPIQuoteReceive {
  id: string
  timestamp: Date
  userId: string
  serverId: string
  channelId: string
  messageId: string
  isLegacy: boolean
}

class StatusDeclarationTransformer implements WisdomAPIStatusDeclaration {
  status: string
  timestamp: Date
}

export class QuoteTransformer implements WisdomAPIQuote {
  id: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  expirationDt: Date
  serverId: string
  channelId: string
  messageId: string
  receives: QuoteReceiveTransformer[]
  statusDeclaration: StatusDeclarationTransformer
  votes: Record<string, Date>
  requiredVoteCount: number
  isLegacy: boolean
  revision: number
}
