/**
 * Global error handler middleware.
 * Must be registered LAST in Express app.
 */
import { logger } from '../utils/logger.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, path: req.path });

  const status = err.status ?? 500;
  const message = status < 500 ? err.message : 'Internal server error';

  res.status(status).json({ success: false, error: message });
}
