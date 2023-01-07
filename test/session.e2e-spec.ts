import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { DiscordUserOAuth2Credentials } from 'src/discord-oauth/types'
import { DateTime } from 'luxon'

describe('SessionController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
  })

  it('should return 200 if there is a session', async () => {
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
      } as any
      next()
    })
    await app.init()

    return request(app.getHttpServer()).get('/session').expect(200)
  })

  it('should return 401 if there is no session', async () => {
    await app.init()

    return request(app.getHttpServer()).get('/session').expect(401)
  })
})
