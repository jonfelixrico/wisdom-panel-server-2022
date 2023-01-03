import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { DiscordOauthModule } from './discord-oauth/discord-oauth.module'
import { SessionGuard } from './guards/session.guard'
import { SessionModule } from './session/session.module'
import { DiscordApiModule } from './discord-api/discord-api.module'
import { WisdomApiModule } from './wisdom-api/wisdom-api.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.defaults'],
    }),
    DiscordOauthModule,
    SessionModule,
    DiscordApiModule,
    WisdomApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
  ],
})
export class AppModule {}
