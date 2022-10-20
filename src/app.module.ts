import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { DiscordOauthModule } from './discord-oauth/discord-oauth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.default'],
    }),
    DiscordOauthModule,
    PassportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
