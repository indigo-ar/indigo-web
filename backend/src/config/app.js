/**
 * Application configuration.
 * All env variables are read here — never access process.env elsewhere.
 */
const config = {
  port:          parseInt(process.env.PORT ?? '3001', 10),
  nodeEnv:       process.env.NODE_ENV ?? 'development',
  frontendUrl:   process.env.FRONTEND_URL ?? 'http://localhost:3456',
  mp: {
    accessToken: process.env.MP_ACCESS_TOKEN ?? '',
  },
};

if (!config.mp.accessToken) {
  console.warn('[config] MP_ACCESS_TOKEN is not set — MercadoPago calls will fail.');
}

export default config;
