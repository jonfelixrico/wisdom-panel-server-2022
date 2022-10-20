import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private cfg: ConfigService) {}

  @UseGuards(AuthGuard('oauth2'))
  @Get()
  async startOAuth() {
    return
  }

  @UseGuards(AuthGuard('oauth2'))
  @Get('callback')
  async oAuthCallback(@Res() res: Response) {
    res.redirect(this.cfg.getOrThrow('URL'))
  }
}
