import axios, { Axios, AxiosError, isAxiosError } from 'axios'
import { RouteBases, RESTJSONErrorCodes } from 'discord-api-types/v10'
import { DiscordUserOAuth2Credentials } from 'src/discord-oauth/types'
import { SessionUserDiscordApiClient } from '../interceptors/inject-session-user-discord-api-client/session-user-discord-api-client.class'

export function createClient(accessToken: string, tokenType: string) {
  return axios.create({
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    baseURL: RouteBases.api,
  })
}

export function createSessionUserClient(
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

export type DiscordError = AxiosError<{
  code: RESTJSONErrorCodes
  message: string
}>

export function isDiscordError(e: unknown): e is DiscordError {
  if (
    !isAxiosError<{
      code: unknown
    }>(e)
  ) {
    return false
  }

  const { data } = e.response

  /*
   * Along with the HTTP error code, our API can also return more detailed error codes through a code key in the JSON error response.
   * The response will also contain a message key containing a more friendly error string.
   *
   * We didn't bother with getting and checking the "errors" object since it's too complex to wrap.
   *
   * See https://discord.com/developers/docs/topics/opcodes-and-status-codes#json
   */
  return typeof data?.code === 'number'
}
