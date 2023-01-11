import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { Test } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { SessionData } from 'express-session'
import {
  RESTGetAPICurrentUserResult,
  RESTPostOAuth2AccessTokenResult,
} from 'discord-api-types/v10'

// TODO replace usages of jest.fn or jest.spyOn with actual axios HTTP interceptors if applicable

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
    let app: INestApplication
    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

      app = moduleFixture.createNestApplication()

      await app.init()
    })

    it('should redirect to FE with error-related query params on OAuth fail', async () => {
      const response = await request(app.getHttpServer()).get(
        '/auth/oauth/discord/callback?error=dummy_error&error_description=dummy_description',
      )

      expect(response.statusCode).toEqual(HttpStatus.FOUND)
      const location = response.get('Location')
      expect(location).toContain('http://frontend')
      expect(location).toContain('error=dummy_error')
      expect(location).toContain('errorDescription=dummy_description')
    })

    it('should redirect to FE with badRequest query params if misuse is detected', async () => {
      const response = await request(app.getHttpServer()).get(
        '/auth/oauth/discord/callback',
      )

      expect(response.statusCode).toEqual(HttpStatus.FOUND)
      const location = response.get('Location')
      expect(location).toContain('http://frontend')
      expect(location).toContain('badRequest=true')
    })
  })

  describe('GET auth/oauth/discord/callback -- success cases', () => {
    let app: INestApplication
    let session: Partial<SessionData> & {
      save: (fn: () => void) => void
    }

    let mockAxios: MockAdapter
    beforeAll(() => {
      mockAxios = new MockAdapter(axios)
      mockAxios.onPost(/token/).reply(200, {
        access_token: 'dummy_token',
        token_type: 'Bearer',
      } as Partial<RESTPostOAuth2AccessTokenResult>)

      mockAxios.onGet(/users\/@me/).reply(200, {
        id: 'dummy_id',
      } as Partial<RESTGetAPICurrentUserResult>)
    })
    afterAll(() => {
      mockAxios.restore()
    })

    beforeEach(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile()

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
      expect(session.userId).toEqual('dummy_id')
      expect(session.credentials).toMatchObject({
        accessToken: 'dummy_token',
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
