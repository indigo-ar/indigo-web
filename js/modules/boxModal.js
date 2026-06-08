/**
 * Box modal module — handles the "Armar mi caja" interaction.
 */
import { PRODUCTS, BOX } from '../config/products.js';
import * as cart from './cart.js';
import * as cartUI from './cartUI.js';

/** @type {Record<number, number>} selection map: productId → qty */
let selection = {};

function totalSelected() {
  return Object.values(selection).reduce((s, q) => s + q, 0);
}

export function init() {
  const openBtn  = document.getElementById('openBoxModal');
  const closeBtn = document.getElementById('boxModalClose');
  const overlay  = document.getElementById('boxModalOverlay');
  const addBtn   = document.getElementById('addBoxToCart');

  if (!openBtn) return;

  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);
  addBtn?.addEventListener('click', handleAddBox);

  // Expose changeQty for inline handlers
  window.__boxChangeQty = changeQty;
}

function openModal() {
  selection = {};
  renderProducts();
  document.getElementById('boxModalOverlay')?.classList.add('modal-overlay--open');
  document.getElementById('boxModal')?.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('boxModalOverlay')?.classList.remove('modal-overlay--open');
  document.getElementById('boxModal')?.classList.remove('modal--open');
  document.body.style.overflow = '';
}

function changeQty(id, delta) {
  const current = selection[id] ?? 0;
  const next = current + delta;
  if (next < 0) return;
  if (delta > 0 && totalSelected() >= BOX.capacity) return;
  selection[id] = next;
  renderProducts();
}

function renderProducts() {
  const container = document.getElementById('modalProducts');
  const counter   = document.getElementById('boxCount');
  const addBtn    = document.getElementById('addBoxToCart');

  const total = totalSelected();
  if (counter) counter.textContent = total;
  if (addBtn) addBtn.disabled = total !== BOX.capacity;

  if (!container) return;

  container.innerHTML = PRODUCTS.map((p) => {
    const qty = selection[p.id] ?? 0;
    return `
      <div class="modal__product">
        <div>
          <p class="modal__product-name">${p.name}</p>
          <p class="modal__product-detail">${p.desc.split(',')[0]}</p>
        </div>
        <div class="modal__qty">
          <button class="modal-qty-btn" onclick="window.__boxChangeQty(${p.id}, -1)" ${qty === 0 ? 'disabled' : ''}>−</button>
          <span class="modal-qty-value">${qty}</span>
          <button class="modal-qty-btn" onclick="window.__boxChangeQty(${p.id}, 1)" ${total >= BOX.capacity ? 'disabled' : ''}>+</button>
        </div>
      </div>
    `;
  }).join('');
}

function handleAddBox() {
  const detail = PRODUCTS
    .filter((p) => (selection[p.id] ?? 0) > 0)
    .map((p) => `${p.name} ×${selection[p.id]}`)
    .join(', ');

  cart.addRawItem({
    id:    `box-${Date.now()}`,
    name:  BOX.name,
    desc:  detail,
    price: BOX.price,
    qty:   1,
    icon:  BOX.icon,
  });

  closeModal();
  cartUI.open();
}
