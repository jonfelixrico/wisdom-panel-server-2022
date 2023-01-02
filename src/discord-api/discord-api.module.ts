import { Module } from '@nestjs/common'
import { provideDiscordBotApi } from './providers/discord-bot-api.provider'
import { provideDiscordBotCache } from './providers/discord-bot-cache.provider'
import { ServerMemberRepositoryService } from './services/server-member-repository/server-member-repository.service'
import { ServerMemberController } from './controllers/server-member/server-member.controller'

@Module({
  providers: [
    provideDiscordBotApi(),
    provideDiscordBotCache(),
    ServerMemberRepositoryService,
  ],
  exports: [ServerMemberRepositoryService],
  controllers: [ServerMemberController],
})
export class DiscordApiModule {}
