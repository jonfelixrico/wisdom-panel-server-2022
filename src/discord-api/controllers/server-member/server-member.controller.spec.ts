import { Test, TestingModule } from '@nestjs/testing'
import { ServerMemberController } from './server-member.controller'

describe('ServerMemberController', () => {
  let controller: ServerMemberController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerMemberController],
    }).compile()

    controller = module.get<ServerMemberController>(ServerMemberController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
