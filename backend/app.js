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
const allowedOrigins = [
  config.frontendUrl,
  'https://indigo-ar.github.io',
  'http://localhost:3456',
  'http://localhost:5500',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      cb(null, true);
    } else {
      cb(new Error(`CORS: origen no permitido → ${origin}`));
    }
  }
}));
app.use(express.json());

// ── Routes ──
app.use('/api', router);

// ── Error handler (must be last) ──
app.use(errorHandler);

export default app;
