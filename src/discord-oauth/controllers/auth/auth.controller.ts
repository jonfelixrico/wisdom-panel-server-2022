import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('oauth2'))
  @Get()
  async startOAuth() {
    return
  }

  @UseGuards(AuthGuard('oauth2'))
  @Get('callback')
  async oAuthCallback() {
    return
  }
}
