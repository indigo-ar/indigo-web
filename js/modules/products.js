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
  grid.innerHTML = PRODUCTS.map((product, index) => `
    <div class="product-card">
<div class="product-card__chips">
        <span class="chip chip--${product.tapa}" title="${product.tapa === 'vainilla' ? 'Vainilla' : 'Chocolate'}"></span>
        <span class="chip chip--${product.cobertura}" title="${product.cobertura === 'blanco' ? 'Blanco' : product.cobertura === 'leche' ? 'Con leche' : 'Semiamargo'}"></span>
      </div>
      <p class="product-card__name">${product.name}</p>
      <p class="product-card__desc">${product.desc}</p>
      <div class="product-card__footer">
        <span class="product-card__price">${formatPrice(product.price)}</span>
        <button
          class="product-card__add"
          data-product-id="${product.id}"
          aria-label="Agregar ${product.name} al carrito"
        >+</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('[data-product-id]').forEach((btn) => {
    btn.addEventListener('click', () => handleAddToCart(btn));
  });
}

function handleAddToCart(btn) {
  const id = Number(btn.dataset.productId);
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;

  cart.addItem(product);
  showToast(product.name);

  btn.classList.add('product-card__add--added');
  setTimeout(() => btn.classList.remove('product-card__add--added'), 500);
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
