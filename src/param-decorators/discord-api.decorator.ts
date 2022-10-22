import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import axios, { AxiosError } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { DiscordOAuthSessionData } from 'src/discord-oauth/types'
import {
  OAuth2Routes,
  RESTPostOAuth2RefreshTokenResult,
  RESTPostOAuth2RefreshTokenURLEncodedData,
  RouteBases,
} from 'discord-api-types/v10'
import { stringify } from 'qs'
import { convertAccessTokenResponseToData } from 'src/discord-oauth/services/oauth-helper/oauth-helper.service'

/**
 * Retrieves the HTTP client loaded with the session user's Discord credentials.
 */
export const DiscordApi = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const session: DiscordOAuthSessionData = ctx
      .switchToHttp()
      ?.getRequest()?.session
    if (!session?.oauthData) {
      return null
    }

    const instance = axios.create({
      headers: {
        Authorization: `${session.oauthData.tokenType} ${session.oauthData.accessToken}`,
      },
      baseURL: RouteBases.api,
    })

    const refreshTokenData: RESTPostOAuth2RefreshTokenURLEncodedData = {
      client_id: session.oauthConfig.clientId,
      client_secret: session.oauthConfig.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: session.oauthData.refreshToken,
    }

    const refreshAuthLogic = async (failedRequest: AxiosError) => {
      // TODO add some logging
      const { data } = await axios.post<RESTPostOAuth2RefreshTokenResult>(
        OAuth2Routes.tokenURL,
        stringify(refreshTokenData),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )

      const converted = convertAccessTokenResponseToData(data)
      session.oauthData = converted

      failedRequest.response.config.headers[
        'Authorization'
      ] = `${converted.tokenType} ${converted.accessToken}`
    }

    createAuthRefreshInterceptor(instance, refreshAuthLogic)
    return instance
  },
)
