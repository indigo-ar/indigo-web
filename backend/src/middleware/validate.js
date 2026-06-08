/**
 * Request validation middleware factory.
 * Usage: router.post('/path', validate(schema), controller)
 *
 * Each schema is a plain object: { field: validatorFn }
 */

/**
 * @param {Record<string, (value: unknown) => boolean>} schema
 */
export function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, check] of Object.entries(schema)) {
      const value = req.body?.[field];
      if (!check(value)) {
        errors.push(`Invalid or missing field: "${field}"`);
      }
    }

    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    next();
  };
}

// ── Common validators ──
export const isNonEmptyArray = (v) => Array.isArray(v) && v.length > 0;

export const isValidItem = (v) =>
  typeof v === 'object' &&
  v !== null &&
  typeof v.id !== 'undefined' &&
  typeof v.name === 'string' &&
  typeof v.price === 'number' &&
  v.price > 0 &&
  typeof v.qty === 'number' &&
  v.qty > 0;
