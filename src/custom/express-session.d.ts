import { DiscordUserOAuth2Credentials } from '../discord-oauth/types'

declare module 'express-session' {
  interface SessionData {
    tokens: DiscordUserOAuth2Credentials
  }
}
