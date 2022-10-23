import { Controller, Delete, Get, Req } from '@nestjs/common'
import { Request } from 'express'

@Controller('session')
export class SessionController {
  @Get()
  async getSession() {
    return
  }

  @Delete()
  async clearSession(@Req() req: Request) {
    req.session.destroy()
  }
}
