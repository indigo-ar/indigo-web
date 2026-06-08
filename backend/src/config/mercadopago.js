/**
 * MercadoPago client singleton.
 */
import { MercadoPagoConfig } from 'mercadopago';
import config from './app.js';

const mpClient = new MercadoPagoConfig({
  accessToken: config.mp.accessToken,
});

export default mpClient;
