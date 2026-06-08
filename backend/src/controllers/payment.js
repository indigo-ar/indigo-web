/**
 * Payment controller — handles HTTP layer only.
 * Delegates business logic to the payment service.
 */
import { createPreference } from '../services/payment.js';
import { ok, fail } from '../utils/response.js';
import { logger } from '../utils/logger.js';

/**
 * POST /api/payments/preference
 */
export async function createPaymentPreference(req, res, next) {
  try {
    const { items, payer } = req.body;
    const result = await createPreference(items, payer);
    ok(res, result, 201);
  } catch (err) {
    logger.error('Error creating MP preference', { message: err.message });
    next(err);
  }
}
