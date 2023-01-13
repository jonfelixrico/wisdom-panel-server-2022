import { INestApplication } from '@nestjs/common'
import axios from 'axios'
import { DateTime } from 'luxon'
import { DiscordUserOAuth2Credentials } from 'src/discord-oauth/types'

export function mockExpressSession(app: INestApplication) {
  app.use((req, res, next) => {
    const credentials: DiscordUserOAuth2Credentials = {
      accessToken: 'dummy',
      expiresOn: DateTime.now().plus({ hour: 1 }).toJSDate(),
      refreshToken: 'dummy',
      scope: 'dummy',
      tokenType: 'Bearer',
    }

    req.session = {
      credentials,
      userId: 'dummy_user',
    } as any
    req.sessionUserDiscordApi = axios.create()
    req.sessionUserDiscordApi.userId = 'dummy_user'
    next()
  })
}
