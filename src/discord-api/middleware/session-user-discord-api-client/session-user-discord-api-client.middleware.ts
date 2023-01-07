import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class SessionUserDiscordApiClientMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next()
  }
}
