import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ServerMemberApiService } from 'src/discord-api/services/server-member-api/server-member-api.service'

export const SERVER_ID_PARAM_KEY = Symbol()

/**
 * Checks if both the Discord application (bot) and the session user have access
 * to the specified server.
 *
 * SERVER_ID_PARAM_KEY needs to be found in the metadata for this to work.
 */
@Injectable()
export class DiscordServerAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private serverMemberApi: ServerMemberApiService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const serverIdKey = this.reflector.get<string>(
      SERVER_ID_PARAM_KEY,
      context.getHandler(),
    )
    if (!serverIdKey) {
      return true
    }

    const req = context.switchToHttp().getRequest<Request>()
    const serverId = req.params[serverIdKey]
    if (!serverId) {
      throw new Error(
        `Tried to look for "${serverIdKey}" in params but found nothing.`,
      )
    }

    if (!(await this.serverMemberApi.isBotMemberOf(serverId))) {
      // TODO add code do distinguish bot-no-acccess from user-no-access
      throw new ForbiddenException()
    }

    // TODO add checking for user server access
    return true
  }
}