import { Test, TestingModule } from '@nestjs/testing'
import { OauthHelperService } from './oauth-helper.service'

describe('OauthHelperService', () => {
  let service: OauthHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthHelperService],
    }).compile()

    service = module.get<OauthHelperService>(OauthHelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
