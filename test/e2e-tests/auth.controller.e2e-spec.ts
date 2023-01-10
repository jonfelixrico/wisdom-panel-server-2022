import { Test } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { OAuthHelperService } from 'src/discord-oauth/services/oauth-helper/oauth-helper.service'
import { AuthController } from 'src/discord-oauth/controllers/auth/auth.controller'
import { SessionData } from 'express-session'

describe('AuthController (e2e)', () => {
  describe('GET auth/oauth/discord', () => {
    let app: INestApplication

    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()
    })

    it('should redirect to FE if there is already a session', async () => {
      mockExpressSession(app)
      await app.init()

      return request(app.getHttpServer())
        .get('/auth/oauth/discord')
        .expect(HttpStatus.FOUND)
        .expect('Location', /frontend/)
    })

    it('should redirect to the authorization URL if no session is found', async () => {
      await app.init()

      return request(app.getHttpServer())
        .get('/auth/oauth/discord')
        .expect(HttpStatus.FOUND)
        .expect('Location', /authorization/)
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
    let app: INestApplication

    let session: Partial<SessionData> & {
      save: (fn: () => void) => void
    }

    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideProvider(OAuthHelperService)
        .useValue({
          exchangeAccessCode: jest.fn().mockResolvedValue({
            accessToken: 'dummy_access_token',
          }),
        } as Pick<OAuthHelperService, 'exchangeAccessCode'>)
        .compile()

      app = moduleFixture.createNestApplication()

      // for us to be able to manipulate and check the session created
      app.use((req, res, next) => {
        session = {
          save: (callback) => callback(),
        }

        req.session = session
        next()
      })

      await app.init()

      const controller = app.get(AuthController)
      jest
        .spyOn(controller, 'fetchUserIdUsingToken')
        .mockResolvedValue('dummy-id')
    })

    it('should create a session then redirect to the FE', async () => {
      const response = await request(app.getHttpServer()).get(
        '/auth/oauth/discord/callback?code=dummy_code&state=dummy_state',
      )

      // check redirect
      expect(response.statusCode).toEqual(HttpStatus.FOUND)
      const location = response.get('Location')
      expect(location).toContain('http://frontend')
      expect(location).toContain('state=dummy_state')

      // check session
      expect(session.userId).toEqual('dummy-id')
      expect(session.credentials).toMatchObject({
        accessToken: 'dummy_access_token',
      })
    })
  })

  describe('GET auth/oauth/discord/callback -- misc cases', () => {
    let app: INestApplication

    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()
    })

    it('should redirect to FE if there is already a session', async () => {
      mockExpressSession(app)
      await app.init()

      return request(app.getHttpServer())
        .get('/auth/oauth/discord/callback')
        .expect(HttpStatus.FOUND)
        .expect('Location', /frontend/)
    })
  })
})
