import { Controller, Delete, Get, Req } from '@nestjs/common'
import { Request } from 'express'

@Controller('session')
export class SessionController {
  /**
   * Sole purpose is for session-checking.
   * @returns
   */
  @Get()
  async getSession() {
    /*
     * Empty since we intend this to just return 200 if a session exists and 401 if otherwise
     */
    return
  }

  @Delete()
  async destroySession(@Req() req: Request) {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
