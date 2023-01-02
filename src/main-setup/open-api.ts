import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { version } from 'package.json'

export function openApiSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Wisdom Panel')
    .setVersion(version)
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('openapi', app, document)
}
