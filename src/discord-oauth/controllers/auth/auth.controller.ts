import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { SessionData } from 'express-session'
import {
  AccessToken,
  OAuthHelperService,
} from 'src/discord-oauth/services/oauth-helper/oauth-helper.service'
import { PublicRoute } from 'src/guards/public-route.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

interface CodePayload {
  code: string
}

declare module 'express-session' {
  interface SessionData {
    tokens: AccessToken
  }
}

@ApiTags('OAuth')
@Controller('auth/oauth/discord')
export class AuthController {
  constructor(
    private oauthHelper: OAuthHelperService,
    private cfg: ConfigService,
  ) {}

  @ApiOperation({
    description:
      'Starts the Authorization Code Grant flow for Discord. This will redirect the user to the Discord auth page. Accepts query params.',
    externalDocs: {
      url: 'https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-authorization-url-example',
      description: 'Check only the "Authorization URL example" part',
    },
    operationId: 'startDiscordOAuth',
  })
  @PublicRoute()
  @Get()
  startOAuth(@Res() res: Response, @Req() req: Request) {
    // TODO redirect back to FE if already authenticated
    const query = req.query ?? {}

    let stringified: string
    if (Object.keys(query).length) {
      stringified = JSON.stringify(query)
    }

    res.redirect(this.oauthHelper.generateAuthorizationUrl(stringified))
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
    @Session() session: SessionData,
  ) {
    const authToken = await this.oauthHelper.exchangeAccessCode(code)
    session.tokens = authToken
  }
}
