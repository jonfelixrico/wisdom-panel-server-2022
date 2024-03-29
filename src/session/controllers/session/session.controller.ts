import { Controller, Delete, Get, Logger, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

@ApiTags('session')
@Controller('session')
/**
 * Contains generic session-related endpoints such as checking and deleting (logging out).
 * Does not contain authentication endpoints since there are many mediums to authentication such as
 * OAuth, password, social login, etc. Those will be handled by their dedicated controllers.
 */
export class SessionController {
  private readonly LOGGER = new Logger(SessionController.name)

  @ApiOperation({
    description: 'For session-checking',
  })
  @Get()
  async getSession() {
    /*
     * Empty since we intend this to just return 200 if a session exists and 401 if otherwise
     */
    return
  }

  @ApiOperation({
    description: 'Logs the user out',
  })
  @Delete()
  async logOut(@Req() req: Request) {
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
