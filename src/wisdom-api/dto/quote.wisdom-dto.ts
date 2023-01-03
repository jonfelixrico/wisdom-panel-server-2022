export interface WisdomApiQuoteReceiveDto {
  id: string
  userId: string
}

export interface WisdomApiQuoteDto {
  id: string
  content: string
  authorId: string
  submitterId: string
  submitDt: Date
  receives: WisdomApiQuoteReceiveDto[]
}
