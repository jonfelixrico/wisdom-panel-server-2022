import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { WisdomCoreApiClient } from './wisdom-core-api-client.class'

@Module({
  providers: [
    {
      provide: WisdomCoreApiClient,
      useFactory: (svc: ConfigService) =>
        axios.create({
          baseURL: svc.getOrThrow('WISDOM_CORE_BASE_URL'),
        }),
      inject: [ConfigService],
    },
  ],

  exports: [WisdomCoreApiClient],
})
export class WisdomCoreApiModule {}
