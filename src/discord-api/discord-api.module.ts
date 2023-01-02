import { Module } from '@nestjs/common'
import { DISCORD_BOT_API_PROVIDER } from './providers/discord-bot-api'
import { DiscordBotApiClient } from './providers/discord-bot-api/discord-bot-api-client.class'
import { ServerMemberRepositoryService } from './services/server-member-repository/server-member-repository.service'

@Module({
  providers: [DISCORD_BOT_API_PROVIDER, ServerMemberRepositoryService],
  exports: [DiscordBotApiClient, ServerMemberRepositoryService],
})
export class DiscordApiModule {}
