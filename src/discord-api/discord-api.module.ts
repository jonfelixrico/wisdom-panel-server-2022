import { Module } from '@nestjs/common'
import { provideDiscordBotApi } from './providers/discord-bot-api.provider'
import { ServerMemberRepositoryService } from './services/server-member-repository/server-member-repository.service'

@Module({
  providers: [provideDiscordBotApi(), ServerMemberRepositoryService],
  exports: [ServerMemberRepositoryService],
})
export class DiscordApiModule {}
