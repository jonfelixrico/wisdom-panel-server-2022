import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { OAuthHelperService } from 'src/discord-oauth/services/oauth-helper/oauth-helper.service'
import { OAuthSession } from 'src/discord-oauth/types'
import { PublicRoute } from 'src/guards/public-route.decorator'

interface CodePayload {
  code: string
}

@Controller('auth/oauth/discord')
export class AuthController {
  constructor(private helper: OAuthHelperService, private cfg: ConfigService) {}

  @PublicRoute()
  @Get()
  startOAuth(@Res() res: Response, @Req() req: Request) {
    const query = req.query ?? {}

    let stringified: string
    if (Object.keys(query).length) {
      stringified = JSON.stringify(query)
    }

    res.redirect(this.helper.generateAuthorizationUrl(stringified))
  }

  @PublicRoute()
  @Get('callback')
  async oauthCallback(@Res() res: Response, @Req() req: Request) {
    const url = new URL(
      this.cfg.getOrThrow('DISCORD_OAUTH_FRONTEND_CALLBACK_URL'),
    )

    const sp = url.searchParams
    for (const key in req.query) {
      const value = req.query[key]
      if (typeof value === 'string') {
        sp.append(key, value)
      } else {
        sp.append(key, JSON.stringify(value))
      }
    }

    res.redirect(url.toString())
  }

  @PublicRoute()
  @Post()
  async exchangeAccessCode(
    @Body() { code }: CodePayload,
    @Session() session: OAuthSession,
  ) {
    session.oauthData = await this.helper.exchangeAccessCode(code)
  }
}
