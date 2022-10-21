import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

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

  constructor(cfg: ConfigService) {
    this.config = {
      clientId: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_ID'),
      clientSecret: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_SECRET'),

      callbackUrl: cfg.getOrThrow('DISCORD_OAUTH_CALLBACK_URL'),
      scope: cfg.getOrThrow('DISCORD_OAUTH_SCOPE'),

      authorizationUrl: cfg.getOrThrow('DISCORD_OAUTH_AUTHORIZATION_URL'),
      tokenUrl: cfg.getOrThrow('DISCORD_OAUTH_TOKEN_URL'),
    }
  }

  generateUrl(state?: string): string {
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
}
