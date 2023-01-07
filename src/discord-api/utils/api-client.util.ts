import axios from 'axios'
import {
  OAuth2Routes,
  RESTPostOAuth2RefreshTokenResult,
  RESTPostOAuth2RefreshTokenURLEncodedData,
  RouteBases,
} from 'discord-api-types/v10'
import { stringify } from 'qs'

interface AppOAuth2ClientInformation {
  clientId: string
  clientSecret: string
}

export function createClient(accessToken: string, tokenType: string) {
  return axios.create({
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    baseURL: RouteBases.api,
  })
}

export async function refreshToken(
  refreshToken: string,
  appClientInfo: AppOAuth2ClientInformation,
) {
  const refreshTokenData: RESTPostOAuth2RefreshTokenURLEncodedData = {
    client_id: appClientInfo.clientId,
    client_secret: appClientInfo.clientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }

  const { data } = await axios.post<RESTPostOAuth2RefreshTokenResult>(
    OAuth2Routes.tokenURL,
    stringify(refreshTokenData),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
  return data
}
