import { Test, TestingModule } from '@nestjs/testing'
import { ServerMemberRepositoryService } from './server-member-repository.service'

describe('ServerMemberRepositoryService', () => {
  let service: ServerMemberRepositoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerMemberRepositoryService],
    }).compile()

    service = module.get<ServerMemberRepositoryService>(
      ServerMemberRepositoryService,
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
