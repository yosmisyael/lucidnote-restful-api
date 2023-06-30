import { logger } from './apps/logging.js'
import { web } from './apps/web.js'

web.listen(3100, () => {
  logger.info('app start')
})
