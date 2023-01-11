import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { RESTGetAPIGuildMemberResult } from 'discord-api-types/v10'
import * as avatarUtil from 'src/discord-api/utils/avatar.util'

jest.spyOn(avatarUtil, 'getMemberAvatarUrl').mockImplementation(() => '')

describe('DiscordServerAccessGuard (e2e)', () => {
  let app: INestApplication

  let mock: MockAdapter
  beforeAll(() => {
    mock = new MockAdapter(axios)

    mock.onGet(/guilds\/dummy_server\/members\/dummy_user$/).reply(200, {
      nick: 'dummy_nick',
      avatar: 'dummy_avatar',
      user: {
        id: 'dummy_id',
      },
    } as Partial<RESTGetAPIGuildMemberResult>)
  })
  afterAll(() => {
    mock.restore()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    mockExpressSession(app)

    await app.init()
  })

  it('should return status 200 if both bot and user have access', async () => {
    mock.onGet(/guilds\/dummy_server$/).reply(200)
    mock.onGet(/users\/@me\/guilds\/dummy_server\/member$/).reply(200)

    return request(app.getHttpServer())
      .get('/server/dummy_server/user/dummy_user')
      .expect(200)
  })

  it('should return status 403 if only user has access', async () => {
    mock.onGet(/guilds\/dummy_server$/).reply(403, {
      code: 1234,
    })
    mock.onGet(/users\/@me\/guilds\/dummy_server\/member$/).reply(200)

    return request(app.getHttpServer())
      .get('/server/dummy_server/user/dummy_user')
      .expect(403)
  })

  it('should return status 403 if only bot has access', async () => {
    mock.onGet(/guilds\/dummy_server$/).reply(200)
    mock.onGet(/users\/@me\/guilds\/dummy_server\/member$/).reply(403, {
      code: 1234,
    })

    return request(app.getHttpServer())
      .get('/server/dummy_server/user/dummy_user')
      .expect(403)
  })

  it('should return status 403 if neither have access', async () => {
    mock.onGet(/guilds\/dummy_server$/).reply(403, {
      code: 1234,
    })
    mock.onGet(/users\/@me\/guilds\/dummy_server\/member$/).reply(403, {
      code: 1234,
    })

    return request(app.getHttpServer())
      .get('/server/dummy_server/user/dummy_user')
      .expect(403)
  })
})
