import { Module } from '@nestjs/common'
import { provideWisdomApiClient } from './providers/wisdom-api-client.provider'
import { QuoteApiService } from './services/quote-api/quote-api.service'

@Module({
  providers: [provideWisdomApiClient(), QuoteApiService],
  exports: [QuoteApiService],
})
export class WisdomApiModule {}
