import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'
import { randomUUID } from 'crypto'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(
    session({
      secret: randomUUID(),
      resave: false,
      saveUninitialized: false,
    }),
  )

  await app.listen(9085)
}
bootstrap()
