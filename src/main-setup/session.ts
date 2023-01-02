import { INestApplication } from '@nestjs/common'
import * as session from 'express-session'
import { randomUUID } from 'crypto'

export function sessionSetup(app: INestApplication) {
  app.use(
    session({
      secret: randomUUID(),
      resave: false,
      saveUninitialized: false,
    }),
  )
}
