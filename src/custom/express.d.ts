import { SessionUserDiscordApiClient } from 'src/discord-api/interceptors/inject-session-user-discord-api-client/session-user-discord-api-client.class'

declare module 'express' {
  interface Request {
    sessionUserDiscordApi?: SessionUserDiscordApiClient
  }
}
