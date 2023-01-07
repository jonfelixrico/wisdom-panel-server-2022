import { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10'
import { DateTime } from 'luxon'
import { DiscordUserOAuth2Credentials } from '../types'

export function formatOAuth2Result(
  res: RESTPostOAuth2AccessTokenResult,
): DiscordUserOAuth2Credentials {
  return {
    accessToken: res.access_token,
    refreshToken: res.refresh_token,
    scope: res.scope,
    tokenType: res.token_type,
    /*
     * expires_in is just data that respresents how many seconds until the access token expires.
     * we're interested in converting it into a date so we can easily check. expires_in as-is is
     * useless without the reference of when it was received.
     */
    expiresOn: DateTime.now().plus({ seconds: res.expires_in }).toJSDate(),
  }
}
