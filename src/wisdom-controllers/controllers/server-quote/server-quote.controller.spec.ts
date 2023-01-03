import { Test, TestingModule } from '@nestjs/testing'
import { ServerQuoteController } from './server-quote.controller'

describe('ServerQuoteController', () => {
  let controller: ServerQuoteController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerQuoteController],
    }).compile()

    controller = module.get<ServerQuoteController>(ServerQuoteController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
