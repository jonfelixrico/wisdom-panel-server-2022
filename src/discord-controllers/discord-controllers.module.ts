import { Module } from '@nestjs/common'
import { DiscordApiModule } from 'src/discord-api/discord-api.module'
import { ServerMemberController } from './controllers/server-member/server-member.controller'

@Module({
  imports: [DiscordApiModule],
  controllers: [ServerMemberController],
})
export class DiscordControllersModule {}
