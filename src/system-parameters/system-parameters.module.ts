import { Module } from '@nestjs/common'
import { SystemParametersController } from './controllers/system-parameters.controller'

@Module({
  controllers: [SystemParametersController],
})
export class SystemParametersModule {}
