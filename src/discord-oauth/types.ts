export interface DiscordUserOAuth2Credentials {
  accessToken: string
  refreshToken: string
  scope: string
  tokenType: string

  /**
   * The date of when the access token will expire.
   */
  expiresOn: Date
}
