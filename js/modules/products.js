/**
 * Products module — renders the product grid.
 */
import { PRODUCTS } from '../config/products.js';
import * as cart from './cart.js';
import * as cartUI from './cartUI.js';
import { formatPrice } from './utils.js';

export function init() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  renderGrid(grid);
}

function renderGrid(grid) {
  grid.innerHTML = PRODUCTS.map((product) => `
    <div class="product-card" data-card-id="${product.id}">
      <div class="product-card__chips">
        <span class="chip chip--${product.tapa}" title="${product.tapa === 'vainilla' ? 'Vainilla' : 'Chocolate'}"></span>
        <span class="chip chip--${product.cobertura}" title="${product.cobertura === 'blanco' ? 'Blanco' : product.cobertura === 'leche' ? 'Con leche' : 'Semiamargo'}"></span>
      </div>
      <p class="product-card__name">${product.name}</p>
      <p class="product-card__desc">${product.desc}</p>
      <div class="product-card__footer">
        <span class="product-card__price">${formatPrice(product.price)}</span>
        <div class="product-card__qty-ctrl" data-product-id="${product.id}">
          <button class="product-card__add" aria-label="Agregar ${product.name}">+</button>
        </div>
      </div>
    </div>
  `).join('');

  // Click delegation
  grid.addEventListener('click', (e) => {
    const ctrl = e.target.closest('[data-product-id]');
    if (!ctrl) return;
    const id = Number(ctrl.dataset.productId);
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    if (e.target.classList.contains('product-card__add')) {
      cart.addItem(product);
      showToast(product.name);
    } else if (e.target.classList.contains('product-card__minus')) {
      cart.changeQty(id, -1);
    }
  });

  // Keep cards in sync with cart
  cart.subscribe(() => syncCards(grid));
}

function syncCards(grid) {
  const items = cart.getItems();
  grid.querySelectorAll('[data-product-id]').forEach((ctrl) => {
    const id = Number(ctrl.dataset.productId);
    const item = items.find((i) => i.id === id);
    const qty = item ? item.qty : 0;

    if (qty > 0) {
      ctrl.innerHTML = `
        <button class="product-card__minus" aria-label="Quitar uno">−</button>
        <span class="product-card__qty-num">${qty}</span>
        <button class="product-card__add" aria-label="Agregar uno">+</button>
      `;
    } else {
      ctrl.innerHTML = `<button class="product-card__add" aria-label="Agregar">+</button>`;
    }
  });
}

export function showToast(name) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cartToast';
    toast.style.cssText = `
      position:fixed; top:80px; right:24px;
      background:#faf4ef; color:#2a1520;
      border:1px solid rgba(76,39,68,0.18);
      box-shadow:0 8px 32px rgba(42,21,32,0.1);
      padding:12px 18px 12px 14px;
      display:flex; align-items:center; gap:10px;
      font-family:'Inter',sans-serif;
      font-size:0.72rem; letter-spacing:0.08em;
      opacity:0; transform:translateY(-8px) translateX(8px);
      transition:opacity 0.25s, transform 0.25s;
      pointer-events:none; z-index:999;
      white-space:nowrap; min-width:200px;
    `;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <span style="width:20px;height:20px;background:#4c2744;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><polyline points="1,3.5 3.5,6 8,1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <span><strong style="font-weight:500">${name}</strong> agregado</span>
  `;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0) translateX(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px) translateX(8px)';
  }, 2200);
}
