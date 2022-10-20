import { Module } from '@nestjs/common'
import { DiscordOauthModule } from './discord-oauth/discord-oauth.module'

@Module({
  imports: [DiscordOauthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
