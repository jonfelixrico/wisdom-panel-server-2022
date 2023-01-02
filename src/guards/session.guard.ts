import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Observable } from 'rxjs'

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

    const req = context.switchToHttp().getRequest<Request>()
    if (req?.session?.tokens) {
      return true
    }

    throw new UnauthorizedException()
  }
}
