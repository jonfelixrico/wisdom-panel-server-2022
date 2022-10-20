import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth/auth.controller'
import { DiscordStrategyService } from './services/discord-strategy/discord-strategy.service'

@Module({
  controllers: [AuthController],
  providers: [DiscordStrategyService],
})
export class DiscordOauthModule {}
