import { DiscordUserOAuth2Credentials } from '../discord-oauth/types'

declare module 'express-session' {
  interface SessionData {
    /**
     * The credentials of the session user. Can be used to do calls to the Discord API.
     */
    credentials: DiscordUserOAuth2Credentials
    userId: string
  }
}
