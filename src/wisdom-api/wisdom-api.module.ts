import { Module } from '@nestjs/common'
import { provideWisdomApiClient } from './providers/wisdom-api-client.provider'

@Module({
  providers: [provideWisdomApiClient()],
})
export class WisdomApiModule {}
