import { Controller, Get, Param } from '@nestjs/common'
import { BotApiService } from 'src/discord-data/services/bot-api/bot-api.service'

@Controller('discord/server/:serverId')
export class ServerController {
  constructor(private botSvc: BotApiService) {}

  @Get('member')
  async listServerMembers(@Param('serverId') serverId: string) {
    return await this.botSvc.getServerMembers(serverId)
  }
}
