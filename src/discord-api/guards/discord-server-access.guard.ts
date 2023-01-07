import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { ServerMemberApiService } from 'src/discord-api/services/server-member-api/server-member-api.service'

export const SERVER_ID_PARAM_KEY = Symbol()

/**
 * Derived from https://docs.nestjs.com/guards#putting-it-all-together
 *
 * Simply checks if the user is authenticated and has a session.
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

    return await this.serverMemberApi.isBotMemberOf(serverId)
  }
}
