import { Module } from '@nestjs/common'
import { UserController } from './controllers/user/user.controller'
import { ServerController } from './controllers/server/server.controller'

@Module({
  controllers: [UserController, ServerController],
})
export class DiscordDataModule {}
