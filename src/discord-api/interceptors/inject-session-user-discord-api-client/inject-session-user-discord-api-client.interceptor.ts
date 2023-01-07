import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { createClient } from 'src/discord-api/utils/api-client.util'

@Injectable()
export class InjectSessionUserDiscordApiClientInterceptor
  implements NestInterceptor
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle()
    }

    const req = context.switchToHttp().getRequest<Request>()
    const credentials = req.session?.credentials

    if (!credentials) {
      return next.handle()
    }

    const { accessToken, tokenType } = req.session.credentials
    // TODO impl refresh token
    req.sessionUserDiscordApi = createClient(accessToken, tokenType)

    return next.handle()
  }
}
