import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { DiscordOAuthTokens } from 'src/discord-oauth/types'

export const IS_PUBLIC = 'IS_PUBLIC'

/**
 * Derived from https://docs.nestjs.com/guards#putting-it-all-together
 *
 * Simply checks if the user is authenticated and has a session.
 */
@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.reflector.get<boolean>(IS_PUBLIC, context.getHandler())) {
      return true
    }

    const req: { session: DiscordOAuthTokens } = context
      .switchToHttp()
      .getRequest()

    return !!req?.session?.refreshToken
  }
}
