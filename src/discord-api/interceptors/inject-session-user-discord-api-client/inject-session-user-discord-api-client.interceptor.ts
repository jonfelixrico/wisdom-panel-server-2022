import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Axios } from 'axios'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { createClient } from 'src/discord-api/utils/api-client.util'
import { SessionUserDiscordApiClient } from './session-user-discord-api-client.class'

@Injectable()
export class InjectSessionUserDiscordApiClientInterceptor
  implements NestInterceptor
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle()
    }

    const req = context.switchToHttp().getRequest<Request>()
    if (!req.session?.userId) {
      return next.handle()
    }

    const { accessToken, tokenType } = req.session.credentials
    // TODO impl refresh token
    const client = createClient(accessToken, tokenType)
    req.sessionUserDiscordApi = Object.assign<
      Axios,
      Pick<SessionUserDiscordApiClient, 'userId'>
    >(client, {
      userId: req.session.userId,
    })

    return next.handle()
  }
}
