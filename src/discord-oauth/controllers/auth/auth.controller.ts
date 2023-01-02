import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
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
    operationId: 'discordOAuthStart',
  })
  @PublicRoute()
  @Get()
  startOAuth(@Res() res: Response, @Req() req: Request) {
  startOAuth(@Res() res: Response, @Query('state') state: string) {
    // TODO redirect back to FE if already authenticated
    const query = req.query ?? {}
    res.redirect(this.oauthHelper.generateAuthorizationUrl(state))
  }

    let stringified: string
    if (Object.keys(query).length) {
      stringified = JSON.stringify(query)
  private buildRedirectUrl(
    state?: string,
    otherParams: Record<string, string> = {},
  ) {
    const url = new URL(
      this.cfg.getOrThrow('DISCORD_OAUTH_FRONTEND_CALLBACK_URL'),
    )

    for (const key in otherParams) {
      url.searchParams.set(key, otherParams[key])
    }

    if (state) {
      url.searchParams.set('state', state)
    }

    res.redirect(this.oauthHelper.generateAuthorizationUrl(stringified))
    return url.toString()
  }

  @ApiOperation({
    description:
      'The Discord OAuth will redirect here once the user has authorized the app.',
    externalDocs: {
      url: 'https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-redirect-url-example',
      description: 'Check only the "Redirect URL example" part',
    },
    operationId: 'discordOAuthCallback',
    parameters: [
      {
        in: 'query',
        name: 'code',
        schema: {
          type: 'string',
        },
        description:
          'The OAuth code given to us by the Discord OAuth. This is to be exchanged back to Discord for the access and refresh tokens.',
        required: true,
      },
    ],
  })
  @PublicRoute()
  @Get('callback')
  async oauthCallback(@Res() res: Response, @Req() req: Request) {
    const url = new URL(
      this.cfg.getOrThrow('DISCORD_OAUTH_FRONTEND_CALLBACK_URL'),
    )
  async oauthCallback(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: Record<string, string>,
  ) {
    if (req.session.tokens) {
      // Handling for already-authenticated users
      res.redirect(this.buildRedirectUrl())
    } else if (query.code) {
      // OAuth was successful
      const { code, state } = query

    const sp = url.searchParams
    for (const key in req.query) {
      const value = req.query[key]
      if (typeof value === 'string') {
        sp.append(key, value)
      } else {
        sp.append(key, JSON.stringify(value))
      }
    }
      const authToken = await this.oauthHelper.exchangeAccessCode(code)
      req.session.tokens = authToken

    res.redirect(url.toString())
      res.redirect(this.buildRedirectUrl(state))
    } else if (query.error) {
      // OAuth failed
      const { error, error_description: errorDescription, state } = query
      res.redirect(this.buildRedirectUrl(state, { error, errorDescription }))
    } else {
      /*
       * Not authenticated, but no error nor code was present.
       *
       * We're not throwing a 400 bad request since we want the front-end to handle the error handling.
       * Additionally, this is not expected to be called as AJAX.
       */
      res.redirect(this.buildRedirectUrl(undefined, { badRequest: 'true' }))
    }
  }

  @ApiOperation({
    operationId: 'discordOAuthCodeExchange',
    description:
      'Consumes the code provided by Discord and logs the user in. This is the final step.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                description: 'The access grant code',
              },
            },
          },
        },
      },
    },
  })
  @PublicRoute()
  @Post()
  async exchangeAccessCode(@Body() { code }: CodePayload, @Req() req: Request) {
    const authToken = await this.oauthHelper.exchangeAccessCode(code)
    req.session.tokens = authToken
  }
}
