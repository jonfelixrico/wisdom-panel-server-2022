import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { WINSTON_LOGGER } from './logger'
import { openApiSetup } from './open-api'
import { sessionSetup } from './session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WINSTON_LOGGER,
  })

  // -- SETUP --
  sessionSetup(app)
  openApiSetup(app)

  await app.listen(9085)
}
bootstrap()
