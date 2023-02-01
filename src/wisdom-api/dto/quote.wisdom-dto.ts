export interface WisdomApiQuoteReceiveDto {
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

export interface WisdomApiQuoteDto {
  id: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  expirationDt: Date
  serverId: string
  channelId: string
  messageId: string
  receives: WisdomApiQuoteReceiveDto[]
  statusDeclaration: WisdomAPIStatusDeclaration | null
  votes: Record<string, Date>
  requiredVoteCount: number
  isLegacy: boolean
  revision: number
}
