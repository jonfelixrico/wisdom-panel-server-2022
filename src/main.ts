import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WINSTON_LOGGER } from './main-setup/logger'
import { openApiSetup } from './main-setup/open-api'
import { sessionSetup } from './main-setup/session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WINSTON_LOGGER,
  })

  // -- SETUP --
  sessionSetup(app)

  if (process.env.NODE_ENV !== 'development') {
    /*
     * The OpenAPI should only be available for dev envs and never anywhere else,
     * espescially prod.
     */
    openApiSetup(app)
  }

  await app.listen(9085)
}
bootstrap()
