import { Axios } from 'axios'

export abstract class SessionUserDiscordApiClient extends Axios {
  /**
   * The id of the Discord user which owns the credentials for this Axios instance.
   */
  userId: string
}
