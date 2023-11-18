import { Test, TestingModule } from '@nestjs/testing'
import { SystemParametersController } from './system-parameters.controller'

describe('SystemParametersController', () => {
  let controller: SystemParametersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemParametersController],
    }).compile()

    controller = module.get<SystemParametersController>(
      SystemParametersController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
