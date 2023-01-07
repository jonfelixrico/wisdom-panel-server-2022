import { Module } from '@nestjs/common'
import { DiscordApiModule } from 'src/discord-api/discord-api.module'
import { WisdomApiModule } from 'src/wisdom-api/wisdom-api.module'
import { ServerQuoteController } from './controllers/server-quote/server-quote.controller'

@Module({
  imports: [WisdomApiModule, DiscordApiModule],
  controllers: [ServerQuoteController],
})
export class WisdomControllersModule {}
