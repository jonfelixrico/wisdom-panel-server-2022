import { Test } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { ConfigService } from '@nestjs/config'
import { OAuthHelperService } from 'src/discord-oauth/services/oauth-helper/oauth-helper.service'

const MOCK_AUTH_URL = 'http://authorization/'
const MOCK_FE_URL = 'http://frontend/'

describe('AuthController (e2e)', () => {
  describe('GET auth/oauth/discord', () => {
    let app: INestApplication

    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(OAuthHelperService)
        .useValue({
          generateAuthorizationUrl: jest.fn().mockReturnValue(MOCK_AUTH_URL),
        } as Pick<OAuthHelperService, 'generateAuthorizationUrl'>)
        .overrideProvider(ConfigService)
        .useValue({
          getOrThrow: jest.fn().mockReturnValue(MOCK_FE_URL),
        } as Pick<ConfigService, 'getOrThrow'>)
        .compile()

      app = moduleFixture.createNestApplication()
    })

    it('should redirect to FE if there is already a session', async () => {
      mockExpressSession(app)
      await app.init()

      return request(app.getHttpServer())
        .get('/auth/oauth/discord')
        .expect(HttpStatus.FOUND)
        .expect('Location', MOCK_FE_URL)
    })

    it('should redirect to the authorization URL if no session is found', async () => {
      await app.init()

      return request(app.getHttpServer())
        .get('/auth/oauth/discord')
        .expect(HttpStatus.FOUND)
        .expect('Location', MOCK_AUTH_URL)
    })
  })

  describe('GET auth/oauth/discord/callback -- error cases', () => {
    it.todo(
      'should redirect to FE with error query params and state if an error was received',
    )

    it.todo(
      'should redirect to FE with badRequest query params if misuse is detected',
    )
  })

  describe('GET auth/oauth/discord/callback -- success cases', () => {
    it.todo('should redirect to FE with state')
    it.todo('should create a session')
  })

  describe('GET auth/oauth/discord/callback -- misc cases', () => {
    let app: INestApplication

    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(OAuthHelperService)
        .useValue({})
        .overrideProvider(ConfigService)
        .useValue({
          getOrThrow: jest.fn().mockReturnValue(MOCK_FE_URL),
        } as Pick<ConfigService, 'getOrThrow'>)
        .compile()

      app = moduleFixture.createNestApplication()
    })

    it('should redirect to FE if there is already a session', async () => {
      mockExpressSession(app)
      await app.init()

      return request(app.getHttpServer())
        .get('/auth/oauth/discord/callback')
        .expect(HttpStatus.FOUND)
        .expect('Location', MOCK_FE_URL)
    })
  })
})
