import { Controller, Get } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation } from '@nestjs/swagger'
import { PublicRoute } from 'src/decorators/public-route.decorator'

@Controller('system-parameters')
export class SystemParametersController {
  constructor(private cfg: ConfigService) {}

  @Get()
  @PublicRoute()
  @ApiOperation({
    description: 'Lists out the system parameters to be exposed to the FE',
    operationId: 'getPublicSysPars',
  })
  getPublicParameters(): Record<string, string> {
    return {
      DISCORD_BOT_INVITE_URL: this.cfg.getOrThrow('DISCORD_BOT_INVITE_URL'),
    }
  }
}
