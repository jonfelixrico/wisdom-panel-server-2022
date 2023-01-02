import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common'
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
    parameters: [
      {
        in: 'query',
        name: 'state',
        schema: {
          type: 'string',
        },
      },
    ],
  })
  @PublicRoute()
  @Get()
  startOAuth(
    @Res() res: Response,
    @Query('state') state: string,
    @Req() req: Request,
  ) {
    if (req.session?.tokens) {
      res.redirect(this.cfg.getOrThrow('FRONTEND_URL'))
    }

    res.redirect(this.oauthHelper.generateAuthorizationUrl(state))
  }

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
      },
      {
        in: 'query',
        name: 'state',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'error',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'error_description',
        schema: {
          type: 'string',
        },
      },
    ],
  })
  @PublicRoute()
  @Get('callback')
  async oauthCallback(
    @Res() res: Response,
    @Req() req: Request,
    @Query() query: Record<string, string>,
  ) {
    if (req.session.tokens) {
      // Handling for already-authenticated users
      res.redirect(this.cfg.getOrThrow('FRONTEND_URL'))
    } else if (query.code) {
      // OAuth was successful
      const { code, state } = query

      const authToken = await this.oauthHelper.exchangeAccessCode(code)
      req.session.tokens = authToken

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
