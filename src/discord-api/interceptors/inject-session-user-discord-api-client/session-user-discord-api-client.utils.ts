import { Axios } from 'axios'
import { createClient } from 'src/discord-api/utils/api-client.util'
import { DiscordUserOAuth2Credentials } from 'src/discord-oauth/types'
import { SessionUserDiscordApiClient } from './session-user-discord-api-client.class'

export function createSessionUserDiscordApiClient(
  credentials: DiscordUserOAuth2Credentials,
  userId: string,
) {
  const { accessToken, tokenType } = credentials
  // TODO impl refresh token
  const client = createClient(accessToken, tokenType)
  return Object.assign<Axios, Pick<SessionUserDiscordApiClient, 'userId'>>(
    client,
    {
      userId,
    },
  )
}
