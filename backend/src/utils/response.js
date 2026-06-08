/**
 * Standardized API response helpers.
 * Every controller sends responses through here.
 */

/**
 * @param {import('express').Response} res
 * @param {object} data
 * @param {number} [status=200]
 */
export function ok(res, data, status = 200) {
  res.status(status).json({ success: true, data });
}

/**
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [status=400]
 */
export function fail(res, message, status = 400) {
  res.status(status).json({ success: false, error: message });
}
