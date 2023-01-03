import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { Axios } from 'axios'

export class WisdomApiClient extends Axios {}

export function provideWisdomApiClient(): Provider {
  return {
    provide: WisdomApiClient,
    useFactory(cfg: ConfigService) {
      return axios.create({
        baseURL: cfg.getOrThrow('WISDOM_API_URL'),
      })
    },
    inject: [ConfigService],
  }
}
