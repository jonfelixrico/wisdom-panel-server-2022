import { Module } from '@nestjs/common'
import { WisdomApiModule } from 'src/wisdom-api/wisdom-api.module'
import { ServerQuoteController } from './controllers/server-quote/server-quote.controller'

@Module({
  imports: [WisdomApiModule],
  controllers: [ServerQuoteController],
})
export class WisdomControllersModule {}
