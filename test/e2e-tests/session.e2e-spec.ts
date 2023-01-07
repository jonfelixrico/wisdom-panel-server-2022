import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'

describe('SessionController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
  })

  it('should return 200 if there is a session', async () => {
    mockExpressSession(app)
    await app.init()

    return request(app.getHttpServer()).get('/session').expect(200)
  })

  it('should return 401 if there is no session', async () => {
    // session not mocked so this is going to go 401 automatically
    await app.init()

    return request(app.getHttpServer()).get('/session').expect(401)
  })
})
