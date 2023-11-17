import { Test, TestingModule } from '@nestjs/testing'
import { createMock } from '@golevelup/ts-jest'
import { BotServersCacheService } from './bot-servers-cache.service'
import { DiscordBotApiClient } from 'src/discord-api/providers/discord-bot-api.provider'
import { PromiseCache } from 'src/utils/promise-cache.utils'
import { ScheduleModule } from '@nestjs/schedule'

describe('BotServersCacheService', () => {
  describe('getServers', () => {
    let promiseCache: PromiseCache
    let service: BotServersCacheService

    beforeEach(async () => {
      const module = await Test.createTestingModule({
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

  describe('cron job', () => {
    let module: TestingModule
    let runCronJob: jest.SpyInstance

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
        imports: [
          ScheduleModule.forRoot()
        ]
      }).compile()

      runCronJob = jest.spyOn(module.get(BotServersCacheService), 'runCronJob')
    })

    it('fetches the server list on boot', async () => {
      const app = module.createNestApplication()
      await app.init()
      expect(runCronJob).toHaveBeenCalledTimes(1)
    })

    jest.useFakeTimers()
    it('has a cron job to poll servers', async () => {
      const app = module.createNestApplication()
      await app.init()
      expect(runCronJob).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(1000 * 60 * 10)
      expect(runCronJob).toHaveBeenCalledTimes(2)
    })
  })

  describe('Batch-fetching', () => {
    test.todo('rate limit resiliency')

    test.todo('199 servers')
    test.todo('200 servers')
    test.todo('201 servers')
  })
})
