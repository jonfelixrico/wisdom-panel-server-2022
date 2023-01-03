import { Test, TestingModule } from '@nestjs/testing'
import { QuoteApiService } from './quote-api.service'

describe('QuoteApiService', () => {
  let service: QuoteApiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuoteApiService],
    }).compile()

    service = module.get<QuoteApiService>(QuoteApiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
