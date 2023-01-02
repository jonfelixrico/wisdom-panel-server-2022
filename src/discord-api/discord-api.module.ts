import { Module } from '@nestjs/common'
import { DISCORD_BOT_API_PROVIDER } from './providers/discord-bot-api'
import { ServerMemberRepositoryService } from './services/server-member-repository/server-member-repository.service'

@Module({
  providers: [DISCORD_BOT_API_PROVIDER, ServerMemberRepositoryService],
  exports: [ServerMemberRepositoryService],
})
export class DiscordApiModule {}
