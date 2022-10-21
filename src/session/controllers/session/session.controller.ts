import { Controller, Get } from '@nestjs/common'

@Controller('session')
export class SessionController {
  @Get()
  async getSession() {
    return
  }
}
