import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { stringify } from 'qs'
import {
  OAuth2Routes,
  RESTPostOAuth2AccessTokenResult,
} from 'discord-api-types/v10'
import { Axios } from 'axios'

interface Params {
  clientId: string
  clientSecret: string
  callbackUrl: string
  scope: string
}

export interface OAuthData {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
  scope: string
}

export function convertAccessTokenResponseToData(
  data: RESTPostOAuth2AccessTokenResult,
): OAuthData {
  const { access_token, expires_in, refresh_token, token_type, scope } = data
  return {
    accessToken: access_token,
    expiresIn: expires_in,
    refreshToken: refresh_token,
    scope,
    tokenType: token_type,
  }
}

@Injectable()
export class OAuthHelperService {
  private config: Params

  constructor(cfg: ConfigService, private axios: Axios) {
    this.config = {
      clientId: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_ID'),
      clientSecret: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_SECRET'),

      callbackUrl: cfg.getOrThrow('DISCORD_OAUTH_CALLBACK_URL'),
      scope: cfg
        .getOrThrow<string>('DISCORD_OAUTH_SCOPE')
        .split(',')
        .map((s) => s.trim())
        .join(' '),
    }
  }

  get clientConfig() {
    const { clientId, clientSecret } = this.config
    return {
      clientId,
      clientSecret,
    }
  }

  generateAuthorizationUrl(state?: string): string {
    const { clientId, callbackUrl, scope } = this.config

    const url = new URL(OAuth2Routes.authorizationURL)
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

  async exchangeAccessCode(code: string): Promise<OAuthData> {
    const { clientId, clientSecret, callbackUrl } = this.config

    const { data } = await this.axios.post<RESTPostOAuth2AccessTokenResult>(
      OAuth2Routes.tokenURL,
      stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    return convertAccessTokenResponseToData(data)
  }
}
