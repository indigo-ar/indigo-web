/**
 * Payment service — business logic layer.
 * Controllers call this; this calls the MP SDK.
 */
import { Preference } from 'mercadopago';
import mpClient from '../config/mercadopago.js';
import config from '../config/app.js';

/**
 * @typedef {object} CartItem
 * @property {string|number} id
 * @property {string}        name
 * @property {number}        price
 * @property {number}        qty
 */

/**
 * @typedef {object} Payer
 * @property {string} [name]
 * @property {string} [phone]
 */

/**
 * Create a MercadoPago Checkout Pro preference.
 *
 * @param {CartItem[]} items
 * @param {Payer}      payer
 * @returns {Promise<{preferenceId: string, initPoint: string}>}
 */
export async function createPreference(items, payer = {}) {
  const preference = new Preference(mpClient);

  const response = await preference.create({
    body: {
      items: items.map((item) => ({
        id:         String(item.id),
        title:      item.name,
        quantity:   item.qty,
        unit_price: item.price,
        currency_id: 'ARS',
      })),
      payer: {
        name: payer.name ?? '',
        phone: { number: payer.phone ?? '' },
      },
      back_urls: {
        success: `${config.frontendUrl}/alfajores.html?pago=aprobado`,
        failure: `${config.frontendUrl}/alfajores.html?pago=error`,
        pending: `${config.frontendUrl}/alfajores.html?pago=pendiente`,
      },
      auto_return: 'approved',
      statement_descriptor: 'INDIGO ALFAJORES',
      payment_methods: { installments: 1 },
    },
  });

  return {
    preferenceId: response.id,
    initPoint:    response.init_point,
  };
}
