import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Axios } from 'axios'
import {
  RESTPostOAuth2AccessTokenResult,
  RESTPostOAuth2AccessTokenURLEncodedData,
} from 'discord-api-types/v10'
import { stringify } from 'qs'
import { DiscordUserOAuth2Credentials } from 'src/discord-oauth/types'
import { formatOAuth2Result } from 'src/discord-oauth/utils/token.util'

interface Params {
  clientId: string
  clientSecret: string
  callbackUrl: string
  scope: string

  authorizationUrl: string
  tokenUrl: string
}

@Injectable()
export class OAuthHelperService {
  private config: Params

  constructor(cfg: ConfigService, private http: Axios) {
    this.config = {
      clientId: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_ID'),
      clientSecret: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_SECRET'),

      callbackUrl: cfg.getOrThrow('DISCORD_OAUTH_CALLBACK_URL'),
      scope: cfg
        .getOrThrow<string>('DISCORD_OAUTH_SCOPE')
        .split(',')
        .map((s) => s.trim())
        .join(' '),

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

  async exchangeAccessCode(
    code: string,
  ): Promise<DiscordUserOAuth2Credentials> {
    const { tokenUrl, clientId, clientSecret, callbackUrl } = this.config

    const reqData: RESTPostOAuth2AccessTokenURLEncodedData = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl,
    }

    const { data } = await this.http.post<RESTPostOAuth2AccessTokenResult>(
      tokenUrl,
      stringify(reqData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )

    return formatOAuth2Result(data)
  }
}
