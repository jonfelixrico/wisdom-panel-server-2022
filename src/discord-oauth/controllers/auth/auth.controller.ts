import { Controller, Get, Query, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import {
  AccessToken,
  OAuthHelperService,
} from 'src/discord-oauth/services/oauth-helper/oauth-helper.service'
import { PublicRoute } from 'src/guards/public-route.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

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

  private buildFrontEndRedirectUrl(
    state?: string,
    otherParams: Record<string, string> = {},
  ) {
    const url = new URL(
      this.cfg.getOrThrow('DISCORD_OAUTH_FRONTEND_LANDING_PATH'),
      this.cfg.getOrThrow('FRONTEND_URL'),
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

      // Establish the session
      const authToken = await this.oauthHelper.exchangeAccessCode(code)
      req.session.tokens = authToken

      /*
       * Need to call session.save manually because it will not get called automatically by the framework if
       * res.redirect was called.
       */
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })

      // Redirect to FE
      res.redirect(this.buildFrontEndRedirectUrl(state))
    } else if (query.error) {
      // OAuth failed
      const { error, error_description: errorDescription, state } = query
      res.redirect(
        this.buildFrontEndRedirectUrl(state, { error, errorDescription }),
      )
    } else {
      /*
       * Not authenticated, but no error nor code was present.
       *
       * We're not throwing a 400 bad request since we want the front-end to handle the error handling.
       * Additionally, this is not expected to be called as AJAX.
       */
      res.redirect(
        this.buildFrontEndRedirectUrl(undefined, { badRequest: 'true' }),
      )
    }
  }
}
