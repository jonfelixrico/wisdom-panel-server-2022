import { Transform, Type } from 'class-transformer'
import { mapValues } from 'lodash'
import {
  WisdomAPIQuote,
  WisdomAPIQuoteReceive,
  WisdomAPIStatusDeclaration,
} from 'src/wisdom-api/dto/quote.wisdom-dto'

class QuoteReceiveTransformer implements WisdomAPIQuoteReceive {
  id: string
  @Type(() => Date)
  timestamp: Date

  userId: string
  serverId: string
  channelId: string
  messageId: string
  isLegacy: boolean
}

class StatusDeclarationTransformer implements WisdomAPIStatusDeclaration {
  status: string

  @Type(() => Date)
  timestamp: Date
}

export class QuoteTransformer implements WisdomAPIQuote {
  id: string
  content: string
  authorId: string
  submitterId: string

  @Type(() => Date)
  submitDt: Date

  @Type(() => Date)
  expirationDt: Date

  serverId: string
  channelId: string
  messageId: string

  @Type(() => QuoteReceiveTransformer)
  receives: QuoteReceiveTransformer[]

  @Type(() => StatusDeclarationTransformer)
  statusDeclaration: StatusDeclarationTransformer

  @Transform(({ value }: { value: Record<string, string> }) =>
    mapValues(value, (serializedDate) => new Date(serializedDate)),
  )
  votes: Record<string, Date>

  requiredVoteCount: number
  isLegacy: boolean
  revision: number
}
