import { Axios } from 'axios'

export abstract class SessionUserDiscordApiClient extends Axios {
  userId: string
}
