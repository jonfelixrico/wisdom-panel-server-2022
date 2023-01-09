import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { ConfigService } from '@nestjs/config'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
  })

  describe('GET auth/oauth/discord', () => {
    it.todo('should redirect to FE if there is already a session')
    it.todo('should redirect to the authorization URL if no session is found')
  })

  describe('GET auth/oauth/discord/callback', () => {
    it.todo(
      'should redirect to FE with error query params and state if an error was received',
    )

    it.todo(
      'should redirect to FE with badRequest query params if misuse is detected',
    )

    describe('oauth success', () => {
      it.todo('should redirect to FE with state')
      it.todo('should create a session')
    })
  })
})
