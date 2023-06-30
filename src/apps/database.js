import { PrismaClient } from '@prisma/client'
import { logger } from './logging.js'

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
    {
      emit: 'stdout',
      level: 'error'
    },
    {
      emit: 'stdout',
      level: 'info'
    },
    {
      emit: 'stdout',
      level: 'warn'
    }
  ]
})

prismaClient.$on('error', (e) => {
  logger.error(e)
})
prismaClient.$on('warn', (e) => {
  logger.warn(e)
})
prismaClient.$on('info', (e) => {
  logger.info(e)
})
prismaClient.$on('query', (e) => {
  logger.query(e)
})
