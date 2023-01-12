import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { createSessionUserClient } from 'src/discord-api/utils/api-client.util'
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

    req.sessionUserDiscordApi = createSessionUserClient(
      req.session.credentials,
      req.session.userId,
    )

    return next.handle()
  }
}
