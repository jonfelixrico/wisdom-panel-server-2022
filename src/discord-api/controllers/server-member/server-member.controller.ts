import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ServerMemberRepositoryService } from 'src/discord-api/services/server-member-repository/server-member-repository.service'
import { getMemberAvatarUrl } from 'src/discord-api/utils/avatar.utils'
import { ServerMemberDto } from './server-member.dto'

@ApiTags('discord')
@Controller('server/:serverId/user')
export class ServerMemberController {
  constructor(private repo: ServerMemberRepositoryService) {}

  @Get(':userId')
  async getMember(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
  ): Promise<ServerMemberDto> {
    const member = await this.repo.getMember(serverId, userId)

    return {
      username: member.nick || member.user.username,
      avatarUrl: getMemberAvatarUrl(serverId, member),
    }
  }
}
