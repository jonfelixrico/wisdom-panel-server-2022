import { WinstonModule, utilities } from 'nest-winston'
import * as winston from 'winston'
import 'winston-daily-rotate-file'
import 'dotenv-defaults/config'

export const WINSTON_LOGGER = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => new Date().toUTCString(),
        }),
        winston.format.ms(),
        utilities.format.nestLike('Wisdom', {
          colors: true,
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: process.env.LOGS_FILENAME,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      utc: true,
      // TODO find a better formatter
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => new Date().toUTCString(),
        }),
        winston.format.ms(),
        utilities.format.nestLike('Wisdom', {
          colors: false,
        }),
      ),
    }),
  ],
  // TODO make this use env vars instead
  level: 'debug',
})
