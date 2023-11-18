import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PublicRoute } from 'src/decorators/public-route.decorator'

@Controller('system-parameters')
export class SystemParametersController {
  constructor(private cfg: ConfigService) {}

  @Get()
  @PublicRoute()
  getPublicParameters(): Record<string, string> {
    return {
      BOT_INVITE_LINK: this.cfg.getOrThrow('BOT_INVITE_LINK'),
    }
  }
}
