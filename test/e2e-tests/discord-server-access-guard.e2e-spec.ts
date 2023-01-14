import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { RESTGetAPIGuildMemberResult } from 'discord-api-types/v10'

const HTTP_403_BODY = {
  code: 1234,
}
// the value of the app's :serverId param must be the same with discord's :guildId param
const SUPERTEST_TARGET_ENDPOINT = '/server/dummy_server/user/dummy_user'
const BOT_MEMBER_CHECK_ENDPOINT = /guilds\/dummy_server$/
const USER_MEMBER_CHECK_ENDPOINT = /users\/@me\/guilds\/dummy_server\/member$/

describe('DiscordServerAccessGuard (e2e)', () => {
  let app: INestApplication

  let mock: MockAdapter
  beforeAll(() => {
    mock = new MockAdapter(axios)

    mock.onGet(/guilds\/dummy_server\/members$/).reply(200, [
      {
        nick: 'dummy_nick',
        avatar: 'dummy_avatar',
        user: {
          id: 'dummy_user',
        },
      },
    ] as Partial<RESTGetAPIGuildMemberResult>[])
    mock.onGet(/guilds\/dummy_server\/members\/dummy_user$/).reply(200, {
      nick: 'dummy_nick',
      avatar: 'dummy_avatar',
      user: {
        id: 'dummy_user',
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
  afterEach(() => {
    mock.reset()
  })

  it('should return status 200 if both bot and user have access', async () => {
    mock.onGet(BOT_MEMBER_CHECK_ENDPOINT).reply(200, {})
    mock.onGet(USER_MEMBER_CHECK_ENDPOINT).reply(200)

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(200)
  })

  it('should return status 403 if only user has access', async () => {
    mock.onGet(BOT_MEMBER_CHECK_ENDPOINT).reply(403, HTTP_403_BODY)
    mock.onGet(USER_MEMBER_CHECK_ENDPOINT).reply(200)

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(403)
  })

  it('should return status 403 if only bot has access', async () => {
    // TODO define actual server mock data
    mock.onGet(BOT_MEMBER_CHECK_ENDPOINT).reply(200, {})
    mock.onGet(USER_MEMBER_CHECK_ENDPOINT).reply(403, HTTP_403_BODY)

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(403)
  })

  it('should return status 403 if neither have access', async () => {
    mock.onGet(BOT_MEMBER_CHECK_ENDPOINT).reply(403, HTTP_403_BODY)
    mock.onGet(USER_MEMBER_CHECK_ENDPOINT).reply(403, {
      code: 1234,
    })

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(403)
  })
})
