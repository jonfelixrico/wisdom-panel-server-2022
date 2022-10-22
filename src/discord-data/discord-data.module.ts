import { Module } from '@nestjs/common'
import { UserController } from './controllers/user/user.controller'
import { ServerController } from './controllers/server/server.controller'
import { DiscordBotApiClient } from './discord-bot-api-client.class'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { RouteBases } from 'discord-api-types/v10'

@Module({
  providers: [
    {
      provide: DiscordBotApiClient,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        axios.create({
          baseURL: RouteBases.api,
          headers: {
            Authorization: `Bearer ${cfg.getOrThrow('DISCORD_BOT_TOKEN')}`,
          },
        }),
    },
  ],
  controllers: [UserController, ServerController],
})
export class DiscordDataModule {}
