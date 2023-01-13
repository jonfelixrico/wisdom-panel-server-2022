import { SessionUserClient } from 'src/discord-api/utils/api-client.util'

declare module 'express' {
  interface Request {
    sessionUserDiscordApi?: SessionUserClient
  }
}
