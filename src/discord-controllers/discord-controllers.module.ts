import { Module } from '@nestjs/common'
import { DiscordApiModule } from 'src/discord-api/discord-api.module'
import { ServerMemberController } from './controllers/server-member/server-member.controller'
import { ServerService } from './controllers/server/server.service'

@Module({
  imports: [DiscordApiModule],
  controllers: [ServerMemberController],
  providers: [ServerService],
})
export class DiscordControllersModule {}
