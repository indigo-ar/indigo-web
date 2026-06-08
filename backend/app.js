/**
 * Express application setup.
 * Separated from server.js so it can be imported in tests.
 */
import express from 'express';
import cors from 'cors';
import config from './src/config/app.js';
import router from './src/routes/index.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

// ── Middleware ──
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());

// ── Routes ──
app.use('/api', router);

// ── Error handler (must be last) ──
app.use(errorHandler);

export default app;
