import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { DiscordOauthModule } from './discord-oauth/discord-oauth.module'
import { SessionGuard } from './guards/session.guard'
import { SessionModule } from './session/session.module'
import { DiscordApiModule } from './discord-api/discord-api.module'
import { WisdomApiModule } from './wisdom-api/wisdom-api.module'
import { WisdomControllersModule } from './wisdom-controllers/wisdom-controllers.module'
import { DiscordControllersModule } from './discord-controllers/discord-controllers.module'
import { InjectSessionUserDiscordApiClientInterceptor } from './discord-api/interceptors/inject-session-user-discord-api-client/inject-session-user-discord-api-client.interceptor'
import { ScheduleModule } from '@nestjs/schedule'
import { SystemParametersModule } from './system-parameters/system-parameters.module'

function setUpEnvFilePath(): string[] {
  if (process.env.NODE_ENV === 'test') {
    return ['.env.test', '.env.defaults']
  }

  return ['.env', '.env.defaults']
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: setUpEnvFilePath(),
    }),
    DiscordOauthModule,
    SessionModule,
    DiscordApiModule,
    WisdomApiModule,
    WisdomControllersModule,
    DiscordControllersModule,
    ScheduleModule.forRoot(),
    SystemParametersModule,
  ],
  controllers: [],
  providers: [
    SessionGuard,
    {
      provide: APP_GUARD,
      useExisting: SessionGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectSessionUserDiscordApiClientInterceptor,
    },
  ],
})
export class AppModule {}
