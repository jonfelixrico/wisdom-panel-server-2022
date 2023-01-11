import axios, { AxiosError, isAxiosError } from 'axios'
import { RouteBases, RESTJSONErrorCodes } from 'discord-api-types/v10'

export function createClient(accessToken: string, tokenType: string) {
  return axios.create({
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    baseURL: RouteBases.api,
  })
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
