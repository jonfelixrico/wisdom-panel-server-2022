import { HttpStatus } from '@nestjs/common'
import axios, { Axios, AxiosError, isAxiosError } from 'axios'
import {
  RouteBases,
  RESTError,
  RESTRateLimit,
  RESTJSONErrorCodes,
} from 'discord-api-types/v10'
import { DiscordUserOAuth2Credentials } from 'src/discord-oauth/types'

export function createClient(accessToken: string, tokenType: string) {
  return axios.create({
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    baseURL: RouteBases.api,
  })
}

export type SessionUserClient = Axios & {
  /**
   * The id of the user who owns the credentials behind the client instance.
   */
  userId: string
}

export function createSessionUserClient(
  credentials: DiscordUserOAuth2Credentials,
  userId: string,
) {
  const { accessToken, tokenType } = credentials
  // TODO impl refresh token
  const client = createClient(accessToken, tokenType)
  return Object.assign<Axios, Pick<SessionUserClient, 'userId'>>(client, {
    userId,
  })
}

export type DiscordError = AxiosError<RESTError & { code: RESTJSONErrorCodes }>

export type DiscordRateLimitError = AxiosError<
  RESTRateLimit & { code?: RESTJSONErrorCodes }
>

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

export function isDiscordRateLimitError(
  e: unknown,
): e is DiscordRateLimitError {
  if (!isAxiosError<RESTRateLimit>(e)) {
    return false
  }

  if (e.response.status !== HttpStatus.TOO_MANY_REQUESTS) {
    return false
  }

  const { global, message, retry_after } = e.response?.data ?? {}
  return (
    typeof global === 'boolean' &&
    typeof message === 'string' &&
    typeof retry_after === 'number'
  )
}
