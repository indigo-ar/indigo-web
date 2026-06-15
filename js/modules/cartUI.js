/**
 * Cart UI module — renders the cart drawer and syncs the badge.
 * Depends on cart.js state, does NOT manage state itself.
 */
import * as cart from './cart.js';
import { formatPrice } from './utils.js';

const selectors = {
  overlay:   '#cartOverlay',
  drawer:    '#cartDrawer',
  close:     '#cartClose',
  items:     '#drawerItems',
  foot:      '#drawerFoot',
  total:     '#drawerTotal',
  checkout:  '#drawerCheckout',
  badge:     '#cartCount',
  formBlock: '#cartInForm',
  formItems: '#cartInFormItems',
};

function el(sel) {
  return document.querySelector(sel);
}

export function init() {
  cart.subscribe(render);

  el(selectors.close)?.addEventListener('click', close);
  el(selectors.overlay)?.addEventListener('click', close);
  el(selectors.checkout)?.addEventListener('click', () => {
    close();
    document.querySelector('#pedidos')?.scrollIntoView({ behavior: 'smooth' });
  });

  render(); // sync UI with persisted cart on load
}

export function open() {
  el(selectors.drawer)?.classList.add('cart-drawer--open');
  el(selectors.overlay)?.classList.add('cart-overlay--open');
  document.body.style.overflow = 'hidden';
}

export function close() {
  el(selectors.drawer)?.classList.remove('cart-drawer--open');
  el(selectors.overlay)?.classList.remove('cart-overlay--open');
  document.body.style.overflow = '';
}

export function render() {
  renderBadge();
  renderItems();
  renderFormSummary();
}

function renderBadge() {
  const badge = el(selectors.badge);
  if (badge) badge.textContent = cart.getCount();
}

function renderItems() {
  const itemsEl = el(selectors.items);
  const footEl  = el(selectors.foot);
  const totalEl = el(selectors.total);

  if (!itemsEl) return;

  if (cart.isEmpty()) {
    itemsEl.innerHTML = '<p class="cart-drawer__empty">Aún no agregaste alfajores</p>';
    if (footEl) footEl.style.display = 'none';
    return;
  }

  itemsEl.innerHTML = cart.getItems().map((item) => `
    <div class="cart-item">
      <div class="cart-item__chips">
        <span class="chip chip--${item.tapa}"></span>
        <span class="chip chip--${item.cobertura}"></span>
      </div>
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__price">${formatPrice(item.price * item.qty)}</p>
      </div>
      <div class="cart-item__qty">
        <button class="qty-btn" onclick="window.__cartChangeQty('${item.id}', -1)">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" onclick="window.__cartChangeQty('${item.id}', 1)">+</button>
        <button class="qty-btn qty-btn--remove" onclick="window.__cartRemoveItem('${item.id}')" title="Eliminar">✕</button>
      </div>
    </div>
  `).join('');

  if (footEl) footEl.style.display = 'block';
  if (totalEl) totalEl.textContent = formatPrice(cart.getTotal());
}

function renderFormSummary() {
  const block    = el(selectors.formBlock);
  const list     = el(selectors.formItems);
  const totalEl  = document.getElementById('cartInFormTotal');
  const section  = document.getElementById('pedidos');

  if (section) section.style.display = cart.isEmpty() ? 'none' : 'block';

  if (!block || !list) return;

  if (cart.isEmpty()) {
    block.style.display = 'none';
    return;
  }

  block.style.display = 'block';
  list.innerHTML = cart.getItems().map((item) => `
    <div class="cart-in-form__item">
      <span>${item.name} × ${item.qty}</span>
      <span>${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = formatPrice(cart.getTotal());
}

// Expose handlers globally for inline onclick handlers
window.__cartChangeQty = (id, delta) => {
  const numId = Number(id);
  cart.changeQty(isNaN(numId) || String(numId) !== String(id) ? id : numId, delta);
};

window.__cartRemoveItem = (id) => {
  const numId = Number(id);
  cart.removeItem(isNaN(numId) || String(numId) !== String(id) ? id : numId);
};
