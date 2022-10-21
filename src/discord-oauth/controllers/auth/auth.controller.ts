import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { stringify } from 'qs'
import { OAuthHelperService } from 'src/discord-oauth/services/oauth-helper/oauth-helper.service'
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
      sp.append(key, stringify(req.query[key]))
    }

    res.redirect(url.toString())
  }

  @PublicRoute()
  @Post()
  async exchangeAccessCode(
    @Body() { code }: CodePayload,
    @Session() session: Record<string, unknown>,
  ) {
    const authToken = await this.helper.exchangeAccessCode(code)
    session.isAuthenticated = true
    session.tokens = authToken
  }
}
