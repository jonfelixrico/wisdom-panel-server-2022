import { Injectable } from '@nestjs/common'
import { DiscordBotApi } from 'src/discord-api/providers/discord-bot-api.provider'

@Injectable()
export class ServerMemberRepositoryService {
  constructor(private botApi: DiscordBotApi) {}
}
