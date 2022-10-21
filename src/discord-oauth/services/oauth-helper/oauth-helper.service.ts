import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from 'nestjs-http-promise'

interface Params {
  clientId: string
  clientSecret: string
  callbackUrl: string
  scope: string

  authorizationUrl: string
  tokenUrl: string
}

interface AccessTokenResp {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface AccessToken {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
  scope: string
}

@Injectable()
export class OAuthHelperService {
  private config: Params

  constructor(cfg: ConfigService, private http: HttpService) {
    this.config = {
      clientId: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_ID'),
      clientSecret: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_SECRET'),

      callbackUrl: cfg.getOrThrow('DISCORD_OAUTH_CALLBACK_URL'),
      scope: cfg.getOrThrow('DISCORD_OAUTH_SCOPE'),

      authorizationUrl: cfg.getOrThrow('DISCORD_OAUTH_AUTHORIZATION_URL'),
      tokenUrl: cfg.getOrThrow('DISCORD_OAUTH_TOKEN_URL'),
    }
  }

  generateAuthorizationUrl(state?: string): string {
    const { authorizationUrl, clientId, callbackUrl, scope } = this.config

    const url = new URL(authorizationUrl)
    const sp = url.searchParams
    sp.append('client_id', clientId)
    sp.append('redirect_uri', callbackUrl)
    sp.append('response_type', 'code')
    sp.append('scope', scope)

    if (state) {
      sp.append('state', state)
    }

    return url.toString()
  }

  async exchangeAccessCode(code: string): Promise<AccessToken> {
    const { tokenUrl, clientId, clientSecret, scope, callbackUrl } = this.config
    const { data } = await this.http.post<AccessTokenResp>(
      tokenUrl,
      {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        scope,
        code,
        redirect_uri: callbackUrl,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    const { access_token, expires_in, refresh_token, token_type } = data
    return {
      accessToken: access_token,
      expiresIn: expires_in,
      refreshToken: refresh_token,
      scope,
      tokenType: token_type,
    }
  }
}
