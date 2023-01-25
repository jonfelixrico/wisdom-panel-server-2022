import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'
import { BotServersCacheService } from './bot-servers-cache.service'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api.provider'
import { PromiseCache } from 'src/utils/promise-cache.utils'

describe('BotServersCacheService', () => {
  let service: BotServersCacheService
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        BotServersCacheService,
        {
          provide: DiscordBotApiClient,
          useValue: createMock<DiscordBotApiClient>(),
        },
        {
          provide: PromiseCache,
          useValue: createMock<PromiseCache>(),
        },
      ],
    }).compile()

    service = module.get(BotServersCacheService)
  })

  describe('getServers', () => {
    let promiseCache: PromiseCache

    beforeEach(() => {
      promiseCache = module.get(PromiseCache)
    })

    it('should try to fetch servers if it has not been done yet', () => {
      service.getServers()
      // promiseCache.run is called as part of getServers
      expect(promiseCache.run).toBeCalled()
    })

    it('should not fetch servers if it has been done before', () => {
      service['lastCompletedFetch'] = new Date()
      service.getServers()

      expect(promiseCache.run).not.toHaveBeenCalled()
    })
  })
})
