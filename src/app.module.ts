import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DiscordOauthModule } from './discord-oauth/discord-oauth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.default'],
    }),
    DiscordOauthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
