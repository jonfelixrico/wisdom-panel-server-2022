import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, StrategyOptions } from 'passport-oauth2'

@Injectable()
export class DiscordStrategyService extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super(
      {
        authorizationURL: cfg.getOrThrow('DISCORD_OAUTH_AUTHORIZATION_URL'),
        tokenURL: cfg.getOrThrow('DISCORD_OAUTH_TOKEN_URL'),

        clientID: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_ID'),
        clientSecret: cfg.getOrThrow('DISCORD_OAUTH_CLIENT_SECRET'),
        callbackURL: cfg.getOrThrow('DISCORD_OAUTH_CALLBACK_URL'),

        scope: cfg
          .getOrThrow<string>('DISCORD_OAUTH_SCOPE')
          .split(',')
          .map((s) => s.trim()),
      } as StrategyOptions,
      (accessToken, refreshToken, profile, cb) => {
        cb(null, {
          accessToken,
          refreshToken,
        })
      },
    )
  }
}
