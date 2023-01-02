import { Module } from '@nestjs/common'
import { DISCORD_BOT_API_PROVIDER } from './providers/discord-bot-api'
import { DiscordBotApiClient } from './providers/discord-bot-api/discord-bot-api-client.class'

@Module({
  providers: [DISCORD_BOT_API_PROVIDER],
  exports: [DiscordBotApiClient],
})
export class DiscordApiModule {}
