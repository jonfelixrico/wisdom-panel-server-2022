import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const SessionUserDiscordApi = createParamDecorator<void>(
  (_, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>()
    return req.sessionUserDiscordApi
  },
)
