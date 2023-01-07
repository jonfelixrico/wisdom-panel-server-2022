import { SetMetadata } from '@nestjs/common'
import { SERVER_ID_PARAM_KEY } from '../guards/discord-server-access.guard'

/**
 * This will allow other decorators to know the param key used for specify a discord server id.
 */
export const DiscordServerIdParam = () =>
  SetMetadata(SERVER_ID_PARAM_KEY, 'serverId')
