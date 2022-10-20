import { Controller, Get, Req, Res, Session, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'
import { DiscordOAuthTokens } from 'src/discord-oauth/types'
import { PublicRoute } from 'src/guards/public-route.decorator'

@Controller('auth')
export class AuthController {
  constructor(private cfg: ConfigService) {}

  @PublicRoute()
  @UseGuards(AuthGuard('oauth2'))
  @Get()
  async startOAuth() {
    return
  }

  @PublicRoute()
  @UseGuards(AuthGuard('oauth2'))
  @Get('callback')
  async oAuthCallback(
    @Res() res: Response,
    @Req() { user }: Request,
    @Session() session: DiscordOAuthTokens,
  ) {
    Object.assign(session, user)
    res.redirect(this.cfg.getOrThrow('URL'))
  }
}
