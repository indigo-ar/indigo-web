/**
 * Cart module — manages state and renders the cart drawer.
 * Uses a simple pub/sub pattern to notify subscribers on changes.
 */

/** @type {Array<{id: number|string, name: string, price: number, qty: number, icon: string, desc?: string}>} */
let items = [];

/** @type {Array<() => void>} */
const subscribers = [];

/** Subscribe to cart changes */
export function subscribe(fn) {
  subscribers.push(fn);
}

function notify() {
  subscribers.forEach((fn) => fn());
}

// ── Public API ──────────────────────────────────────────────

export function getItems() {
  return [...items];
}

export function getCount() {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function getTotal() {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function isEmpty() {
  return items.length === 0;
}

export function addItem(product) {
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    items.push({ ...product, qty: 1 });
  }
  notify();
}

export function addRawItem(item) {
  items.push({ ...item });
  notify();
}

export function changeQty(id, delta) {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeItem(id);
  else notify();
}

export function removeItem(id) {
  items = items.filter((i) => i.id !== id);
  notify();
}

export function clear() {
  items = [];
  notify();
}
