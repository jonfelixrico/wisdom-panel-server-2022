import { Test, TestingModule } from '@nestjs/testing'
import { DiscordStrategyService } from './discord-strategy.service'

describe('DiscordStrategyService', () => {
  let service: DiscordStrategyService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordStrategyService],
    }).compile()

    service = module.get<DiscordStrategyService>(DiscordStrategyService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
