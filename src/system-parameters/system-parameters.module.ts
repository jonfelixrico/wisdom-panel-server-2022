import { Module } from '@nestjs/common'
import { SystemParametersController } from './system-parameters.controller'

@Module({
  controllers: [SystemParametersController],
})
export class SystemParametersModule {}
