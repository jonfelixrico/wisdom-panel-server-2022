import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { ServerMemberApiService } from 'src/discord-api/services/server-member-api/server-member-api.service'
import { RESTGetAPIGuildMemberResult } from 'discord-api-types/v10'
import * as avatarUtil from 'src/discord-api/utils/avatar.util'

jest.spyOn(avatarUtil, 'getMemberAvatarUrl').mockImplementation(() => '')

describe('DiscordServerAccessGuard (e2e)', () => {
  let app: INestApplication
  let api: ServerMemberApiService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    mockExpressSession(app)

    api = app.get(ServerMemberApiService)
    jest.spyOn(api, 'getMember').mockImplementation(() =>
      Promise.resolve({
        nick: 'dummy',
        user: {
          username: 'dummy',
        },
      } as RESTGetAPIGuildMemberResult),
    )

    await app.init()
  })

  test('target endpoint should return without problem if bot has access to the server', async () => {
    jest
      .spyOn(api, 'isBotMemberOf')
      .mockImplementation(() => Promise.resolve(true))

    return request(app.getHttpServer())
      .get('/server/dummy/user/dummy')
      .expect(200)
  })

  test('target endpoint should return 403 if server id is not accessible by the server', async () => {
    jest
      .spyOn(api, 'isBotMemberOf')
      .mockImplementation(() => Promise.resolve(false))

    return request(app.getHttpServer())
      .get('/server/dummy/user/dummy')
      .expect(403)
  })
})
