import { DiscordUserOAuth2Credentials } from '../discord-oauth/types'

declare module 'express-session' {
  interface SessionData {
    credentials: DiscordUserOAuth2Credentials
    userId: string
  }
}
