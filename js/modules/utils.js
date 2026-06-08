/**
 * Shared utility helpers.
 */

/**
 * Format a number as Argentine peso string.
 * @param {number} amount
 * @returns {string}  e.g. "$3.000"
 */
export function formatPrice(amount) {
  return `$${amount.toLocaleString('es-AR')}`;
}

/**
 * Build a WhatsApp deep-link URL.
 * @param {string} number  e.g. "5491134687322"
 * @param {string} message
 * @returns {string}
 */
export function buildWhatsAppURL(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Query a single DOM element; throws if not found.
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {Element}
 */
export function qs(selector, root = document) {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`Element not found: "${selector}"`);
  return el;
}

/**
 * Query all DOM elements matching selector.
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {Element[]}
 */
export function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}
