import { Test, TestingModule } from '@nestjs/testing'
import { OAuthHelperService } from './oauth-helper.service'

describe('OauthHelperService', () => {
  let service: OAuthHelperService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OAuthHelperService],
    }).compile()

    service = module.get<OAuthHelperService>(OAuthHelperService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
