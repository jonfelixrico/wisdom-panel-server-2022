import { Controller, Get, Param } from '@nestjs/common'
import {
  CDNRoutes,
  ImageFormat,
  DefaultUserAvatarAssets,
} from 'discord-api-types/v10'
import { ServerMemberRepositoryService } from 'src/discord-api/services/server-member-repository/server-member-repository.service'
import { ServerMemberDto } from './server-member.dto'

@Controller('server/:serverId/user')
export class ServerMemberController {
  constructor(private repo: ServerMemberRepositoryService) {}

  @Get(':userId')
  async getMember(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
  ): Promise<ServerMemberDto> {
    const { avatar, nick, user } = await this.repo.getMember(serverId, userId)
    const username = nick || user.username

    let avatarUrl: string
    if (avatar) {
      // get server avatar first
      avatarUrl = CDNRoutes.guildMemberAvatar(
        serverId,
        userId,
        avatar,
        ImageFormat.WebP,
      )
    } else if (user.avatar) {
      // get user avatar if it doesnt exist
      avatarUrl = CDNRoutes.userAvatar(userId, user.avatar, ImageFormat.WebP)
    } else {
      // get default avatar as fallback
      avatarUrl = CDNRoutes.defaultUserAvatar(
        (Number(user.discriminator) % 5) as DefaultUserAvatarAssets,
      )
    }

    return new ServerMemberDto(username, avatarUrl)
  }
}
