import { Module } from '@nestjs/common'
import { ServerMemberController } from './controllers/server-member/server-member.controller'

@Module({
  controllers: [ServerMemberController],
})
export class DiscordControllersModule {}
