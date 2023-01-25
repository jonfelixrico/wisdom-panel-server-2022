import { Module } from '@nestjs/common'
import { provideDiscordBotApiClient } from './providers/discord-bot-api.provider'
import { provideDiscordApiCache } from './providers/discord-api-cache.provider'
import { ServerMemberApiService } from './services/server-member-api/server-member-api.service'
import { BotServersCacheService } from './services/bot-servers-cache/bot-servers-cache.service';

@Module({
  providers: [
    provideDiscordBotApiClient(),
    provideDiscordApiCache(),
    ServerMemberApiService,
    BotServersCacheService,
  ],
  exports: [ServerMemberApiService],
})
export class DiscordApiModule {}
