import { Test, TestingModule } from '@nestjs/testing'
import { SystemParametersController } from './system-parameters.controller'
import * as request from 'supertest'
import { ConfigModule } from '@nestjs/config'
import { HttpStatus } from '@nestjs/common'

describe('SystemParametersController', () => {
  let module: TestingModule

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [SystemParametersController],
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
    }).compile()
  })

  it('should contain syspars', async () => {
    const app = await module.createNestApplication().init()
    await request(app.getHttpServer())
      .get('/system-parameters')
      .expect(HttpStatus.OK)
      .expect((res) =>
        expect(res.body).toEqual(
          expect.objectContaining({
            // these are from the .env.test file

            discordBotInviteUrl: 'https://discord-bot-invite-url',
          }),
        ),
      )
  })
})
