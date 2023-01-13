import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC } from '../guards/session.guard'

export const PublicRoute = () => SetMetadata(IS_PUBLIC, 'true')
