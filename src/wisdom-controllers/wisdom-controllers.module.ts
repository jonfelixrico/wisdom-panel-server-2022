import { Module } from '@nestjs/common'
import { ServerQuoteController } from './controllers/server-quote/server-quote.controller'

@Module({
  controllers: [ServerQuoteController],
})
export class WisdomControllersModule {}
