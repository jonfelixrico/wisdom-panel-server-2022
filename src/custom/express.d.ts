import { AxiosInstance } from 'axios'

declare module 'express' {
  interface Request {
    sessionUserDiscordApi?: AxiosInstance
  }
}
