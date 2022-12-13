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
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(err)
        }

        return resolve()
      })
    })
  }
}
