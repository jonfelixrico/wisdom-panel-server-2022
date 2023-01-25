import { Test, TestingModule } from '@nestjs/testing';
import { BotServersCacheService } from './bot-servers-cache.service';

describe('BotServersCacheService', () => {
  let service: BotServersCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotServersCacheService],
    }).compile();

    service = module.get<BotServersCacheService>(BotServersCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
