import { Test, TestingModule } from '@nestjs/testing'
import { ServerMemberApiService } from './server-member-repository.service'

describe('ServerMemberApiService', () => {
  let service: ServerMemberApiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerMemberApiService],
    }).compile()

    service = module.get<ServerMemberApiService>(ServerMemberApiService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
