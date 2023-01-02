import { Injectable } from '@nestjs/common'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api/discord-bot-api-client.class'

@Injectable()
export class ServerMemberRepositoryService {
  constructor(private botApi: DiscordBotApiClient) {}
}
