import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DiscordServerIdParam } from 'src/discord-api/decorators/discord-server-id-param.decorator'
import { DiscordServerAccessGuard } from 'src/discord-api/guards/discord-server-access.guard'
import { ServerMemberApiService } from 'src/discord-api/services/server-member-api/server-member-api.service'
import { getMemberAvatarUrl } from 'src/discord-controllers/utils/image.util'
import { ServerMemberDto } from './server-member.dto'

@UseGuards(DiscordServerAccessGuard)
@ApiTags('discord')
@Controller('server/:serverId/user')
export class ServerMemberController {
  constructor(private repo: ServerMemberApiService) {}

  @ApiOperation({
    operationId: 'getServerMember',
    summary: "Get info about a server's member",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The server or the member was not found.',
  })
  @DiscordServerIdParam()
  @Get(':userId')
  async getMember(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
  ): Promise<ServerMemberDto> {
    const member = await this.repo.getMember(serverId, userId)
    if (!member) {
      throw new NotFoundException()
    }

    return {
      username: member.nick || member.user.username,
      avatarUrl: getMemberAvatarUrl(serverId, member),
    }
  }
}
