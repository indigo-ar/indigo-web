/**
 * Server entry point — only starts the HTTP server.
 */
import 'dotenv/config';
import app from './app.js';
import config from './src/config/app.js';
import { logger } from './src/utils/logger.js';

app.listen(config.port, () => {
  logger.info(`✅ Índigo backend running on port ${config.port} [${config.nodeEnv}]`);
});
