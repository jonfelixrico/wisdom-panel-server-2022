import { Test, TestingModule } from '@nestjs/testing'
import { OAuthHelperService } from './oauth-helper.service'

describe('OAuthHelperService', () => {
  let service: OAuthHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OAuthHelperService],
    }).compile()

    service = module.get<OAuthHelperService>(OAuthHelperService)
  })

  it.todo('should be defined')
})
