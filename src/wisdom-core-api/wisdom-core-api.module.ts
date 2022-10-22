import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule, HttpService } from 'nestjs-http-promise'
import { WISDOM_CORE_API_HTTP_CLIENT } from './wisdom-core-api-http-client.token'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (svc: ConfigService) => {
        return {
          baseURL: svc.getOrThrow('WISDOM_CORE_BASE_URL'),
        }
      },
    }),
  ],

  providers: [
    {
      provide: WISDOM_CORE_API_HTTP_CLIENT,
      useExisting: HttpService,
    },
  ],

  exports: [HttpService, WISDOM_CORE_API_HTTP_CLIENT],
})
export class WisdomCoreApiModule {}
