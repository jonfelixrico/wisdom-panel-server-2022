import { Module } from '@nestjs/common'
import axios, { Axios } from 'axios'
import { AuthController } from './controllers/auth/auth.controller'
import { OAuthHelperService } from './services/oauth-helper/oauth-helper.service'

@Module({
  controllers: [AuthController],
  providers: [
    OAuthHelperService,
    {
      provide: Axios,
      useValue: axios,
    },
  ],
})
export class DiscordOauthModule {}
