export interface WisdomAPIQuoteReceive {
  id: string
  timestamp: Date
  userId: string
  serverId: string
  channelId: string
  messageId: string
  isLegacy: boolean
}

export interface WisdomAPIStatusDeclaration {
  status: string
  timestamp: Date
}

export interface WisdomAPIQuote {
  id: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  expirationDt: Date
  serverId: string
  channelId: string
  messageId: string
  receives: WisdomAPIQuoteReceive[]
  statusDeclaration: WisdomAPIStatusDeclaration | null
  votes: Record<string, Date>
  requiredVoteCount: number
  isLegacy: boolean
  revision: number
}
