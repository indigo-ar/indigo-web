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
      <p class="product-card__number">0${index + 1}</p>
      <div class="product-card__chips">
        <span class="chip chip--tapa chip--${product.tapa}">${product.tapa === 'vainilla' ? 'Vainilla' : 'Chocolate'}</span>
        <span class="chip chip--cob chip--${product.cobertura}">${product.cobertura === 'blanco' ? 'Blanco' : product.cobertura === 'leche' ? 'Con leche' : 'Semiamargo'}</span>
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
  cartUI.open();

  btn.classList.add('product-card__add--added');
  setTimeout(() => btn.classList.remove('product-card__add--added'), 500);
}
