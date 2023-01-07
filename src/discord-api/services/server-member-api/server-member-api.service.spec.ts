import { Test, TestingModule } from '@nestjs/testing'
import { ServerMemberApiService } from './server-member-api.service'

describe('ServerMemberApiService', () => {
  let service: ServerMemberApiService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerMemberApiService],
    }).compile()

    service = module.get<ServerMemberApiService>(ServerMemberApiService)
  })

  it.todo('it should be defined')
})
