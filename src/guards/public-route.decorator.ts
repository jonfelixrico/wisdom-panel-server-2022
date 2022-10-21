import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC } from './session.guard'

export const PublicRoute = () => SetMetadata(IS_PUBLIC, 'true')
