import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { mockExpressSession } from 'test/utils/mock-express-session'
import { ServerMemberApiService } from 'src/discord-api/services/server-member-api/server-member-api.service'
import { createMock, DeepMocked } from '@golevelup/ts-jest'
import { BotServersCacheService } from 'src/discord-api/services/bot-servers-cache/bot-servers-cache.service'

// the value of the app's :serverId param must be the same with discord's :guildId param
const SUPERTEST_TARGET_ENDPOINT = '/server/dummy_server/user/dummy_user'

describe('DiscordServerAccessGuard (e2e)', () => {
  let app: INestApplication
  let service: DeepMocked<ServerMemberApiService>

  beforeEach(async () => {
    service = createMock<ServerMemberApiService>()
    service.getMember.mockResolvedValue({
      nick: 'dummy_nick',
      avatar: 'dummy_avatar',
      user: {
        id: 'dummy_user',
      },
    } as any)

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ServerMemberApiService)
      .useValue(service)
      .overrideProvider(BotServersCacheService)
      .useValue(createMock<BotServersCacheService>())
      .compile()

    app = moduleFixture.createNestApplication()
    mockExpressSession(app)

    await app.init()
  })

  it('should return status 200 if both bot and user have access', async () => {
    service.isBotMemberOf.mockResolvedValueOnce(true)
    service.isUserMemberOf.mockResolvedValueOnce(true)

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(200)
  })

  it('should return status 403 if only user has access', async () => {
    service.isBotMemberOf.mockResolvedValueOnce(false)
    service.isUserMemberOf.mockResolvedValueOnce(true)

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(403)
  })

  it('should return status 403 if only bot has access', async () => {
    service.isBotMemberOf.mockResolvedValueOnce(true)
    service.isUserMemberOf.mockResolvedValueOnce(false)

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(403)
  })

  it('should return status 403 if neither have access', async () => {
    service.isBotMemberOf.mockResolvedValueOnce(false)
    service.isUserMemberOf.mockResolvedValueOnce(false)

    return request(app.getHttpServer())
      .get(SUPERTEST_TARGET_ENDPOINT)
      .expect(403)
  })
})
