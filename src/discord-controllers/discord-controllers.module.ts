import { Module } from '@nestjs/common'
import { DiscordApiModule } from 'src/discord-api/discord-api.module'
import { ServerMemberController } from './controllers/server-member/server-member.controller'
import { ServerController } from './controllers/server/server.controller'

@Module({
  imports: [DiscordApiModule],
  controllers: [ServerMemberController, ServerController],
})
export class DiscordControllersModule {}
