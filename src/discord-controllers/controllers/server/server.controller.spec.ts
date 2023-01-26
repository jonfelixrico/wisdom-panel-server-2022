import { Test, TestingModule } from '@nestjs/testing'
import { ServerController } from './server.controller'

describe('ServerController', () => {
  let controller: ServerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServerController],
    }).compile()

    controller = module.get<ServerController>(ServerController)
  })

  it.todo('should be defined')
})
