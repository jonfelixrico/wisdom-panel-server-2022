import { Test, TestingModule } from '@nestjs/testing'
import { ServerApiService } from './server-api.service'

describe('ServerApiService', () => {
  let service: ServerApiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerApiService],
    }).compile()

    service = module.get<ServerApiService>(ServerApiService)
  })

  it.todo('should be defined')
})
