import { Test, TestingModule } from '@nestjs/testing'
import { ServerQuotesController } from './server-quotes.controller'

describe('ServerQuotesController', () => {
  let controller: ServerQuotesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerQuotesController],
    }).compile()

    controller = module.get<ServerQuotesController>(ServerQuotesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
