import { Controller, Delete, Get, Logger, Req } from '@nestjs/common'
import { Request } from 'express'

@Controller('session')
export class SessionController {
  private readonly LOGGER = new Logger(SessionController.name)

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
    const { LOGGER } = this

    // TODO include user id here
    LOGGER.debug('Logout attempted by user')
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err: Error) => {
        if (err) {
          reject(err)
          // TODO include user id here
          LOGGER.error(
            `Error encountered while logging out: ${err.message}`,
            err.stack,
          )
        } else {
          // TODO include user id here
          LOGGER.verbose('User has logged out')
          resolve()
        }
      })
    })
  }
}
