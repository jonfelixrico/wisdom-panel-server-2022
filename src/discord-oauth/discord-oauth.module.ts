import { Module } from '@nestjs/common'
import { HttpModule } from 'nestjs-http-promise'
import { AuthController } from './controllers/auth/auth.controller'
import { OAuthHelperService } from './services/oauth-helper/oauth-helper.service'

@Module({
  controllers: [AuthController],
  providers: [OAuthHelperService],
  imports: [HttpModule],
})
export class DiscordOauthModule {}
