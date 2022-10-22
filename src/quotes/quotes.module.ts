import { Module } from '@nestjs/common'
import { WisdomCoreApiModule } from 'src/wisdom-core-api/wisdom-core-api.module'
import { ServerQuotesController } from './controllers/server-quotes/server-quotes.controller'

@Module({
  imports: [WisdomCoreApiModule],
  controllers: [ServerQuotesController],
})
export class QuotesModule {}
