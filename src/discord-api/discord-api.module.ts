import { Module } from '@nestjs/common'
import { provideDiscordBotApiClient } from './providers/discord-bot-api.provider'
import { provideDiscordBotCache } from './providers/discord-bot-cache.provider'
import { ServerMemberApiService } from './services/server-member-repository/server-member-repository.service'

@Module({
  providers: [
    provideDiscordBotApiClient(),
    provideDiscordBotCache(),
    ServerMemberApiService,
  ],
  exports: [ServerMemberApiService],
})
export class DiscordApiModule {}
