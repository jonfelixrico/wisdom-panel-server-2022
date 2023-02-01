import { Module } from '@nestjs/common'
import { SessionController } from './controllers/session/session.controller'

@Module({
  controllers: [SessionController],
})
export class SessionModule {}
