import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { HttpModule } from 'nestjs-http-promise'
import { AuthController } from './controllers/auth/auth.controller'
import { DiscordStrategyService } from './services/discord-strategy/discord-strategy.service'
import { OAuthHelperService } from './services/oauth-helper/oauth-helper.service'

@Module({
  controllers: [AuthController],
  providers: [DiscordStrategyService, OAuthHelperService],
  imports: [
    PassportModule.register({
      session: true,
    }),
    HttpModule,
  ],
})
export class DiscordOauthModule {}
