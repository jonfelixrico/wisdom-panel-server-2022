import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ServerMemberApiService } from 'src/discord-api/services/server-member-api/server-member-api.service'
import { createSessionUserClient } from '../utils/api-client.util'

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

    const client = createSessionUserClient(
      req.session.credentials,
      req.session.userId,
    )

    if (!(await this.serverMemberApi.isUserMemberOf(client, serverId))) {
      // TODO add code do distinguish bot-no-acccess from user-no-access
      throw new ForbiddenException()
    }

    return true
  }
}
