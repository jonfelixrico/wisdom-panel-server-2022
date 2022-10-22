import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { DiscordOauthModule } from './discord-oauth/discord-oauth.module'
import { SessionGuard } from './guards/session.guard'
import { SessionModule } from './session/session.module'
import { DiscordDataModule } from './discord-data/discord-data.module'
import { QuotesModule } from './quotes/quotes.module'
import { WisdomCoreApiModule } from './wisdom-core-api/wisdom-core-api.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.default'],
    }),
    DiscordOauthModule,
    SessionModule,
    DiscordDataModule,
    QuotesModule,
    WisdomCoreApiModule,
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
