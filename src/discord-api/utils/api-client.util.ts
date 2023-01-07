import axios from 'axios'
import { RouteBases } from 'discord-api-types/v10'

export function createClient(accessToken: string, tokenType: string) {
  return axios.create({
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    baseURL: RouteBases.api,
  })
}
