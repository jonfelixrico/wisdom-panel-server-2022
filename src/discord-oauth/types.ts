import { OAuthData } from './services/oauth-helper/oauth-helper.service'

export interface DiscordOAuthSessionData {
  oauthData: OAuthData
  oauthConfig: {
    clientId: string
    clientSecret: string
  }
}
