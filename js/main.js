const PRODUCTS = [
  { id: 1, name: 'Vainilla · Blanco',      desc: 'Tapas de vainilla, relleno de dulce de leche, cobertura de chocolate blanco.',      price: 3000, emoji: '○' },
  { id: 2, name: 'Vainilla · Con leche',   desc: 'Tapas de vainilla, relleno de dulce de leche, cobertura de chocolate con leche.',   price: 3000, emoji: '◌' },
  { id: 3, name: 'Vainilla · Semiamargo',  desc: 'Tapas de vainilla, relleno de dulce de leche, cobertura de chocolate semiamargo.',  price: 3000, emoji: '◎' },
  { id: 4, name: 'Chocolate · Blanco',     desc: 'Tapas de chocolate, relleno de dulce de leche, cobertura de chocolate blanco.',     price: 3000, emoji: '◉' },
  { id: 5, name: 'Chocolate · Con leche',  desc: 'Tapas de chocolate, relleno de dulce de leche, cobertura de chocolate con leche.',  price: 3000, emoji: '◈' },
  { id: 6, name: 'Chocolate · Semiamargo', desc: 'Tapas de chocolate, relleno de dulce de leche, cobertura de chocolate semiamargo.', price: 3000, emoji: '□' },
];

let cart = [];

// ── Render products ──
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <div class="product-card">
      <p class="product-num">0${i + 1}</p>
      <div class="product-visual" style="font-family:monospace;color:var(--indigo);font-size:2rem">${p.emoji}</div>
      <p class="product-name">${p.name}</p>
      <p class="product-desc">${p.desc}</p>
      <div class="product-footer-row">
        <span class="product-price">$${p.price.toLocaleString('es-AR')}</span>
        <button class="product-add" data-id="${p.id}" aria-label="Agregar">+</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.product-add').forEach(btn => {
    btn.addEventListener('click', () => addToCart(+btn.dataset.id, btn));
  });
}

// ── Cart logic ──
function addToCart(id, btn) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  existing ? existing.qty++ : cart.push({ ...product, qty: 1 });
  btn.classList.add('added');
  setTimeout(() => btn.classList.remove('added'), 500);
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cartCount').textContent = count;

  const items = document.getElementById('drawerItems');
  const foot  = document.getElementById('drawerFoot');

  if (cart.length === 0) {
    items.innerHTML = '<p class="drawer-empty">Aún no agregaste alfajores</p>';
    foot.style.display = 'none';
  } else {
    items.innerHTML = cart.map(i => `
      <div class="drawer-item">
        <span class="drawer-item-icon" style="font-family:monospace;color:var(--indigo)">${i.emoji}</span>
        <div class="drawer-item-info">
          <p class="drawer-item-name">${i.name}</p>
          <p class="drawer-item-price">$${(i.price * i.qty).toLocaleString('es-AR')}</p>
        </div>
        <div class="drawer-qty">
          <button class="dqty-btn" onclick="changeQty(${i.id}, -1)">−</button>
          <span class="dqty-val">${i.qty}</span>
          <button class="dqty-btn" onclick="changeQty(${i.id}, 1)">+</button>
        </div>
      </div>
    `).join('');
    foot.style.display = 'block';
    document.getElementById('drawerTotal').textContent = `$${total.toLocaleString('es-AR')}`;
  }

  // update form summary
  const formBlock = document.getElementById('cartInForm');
  const formItems = document.getElementById('cartInFormItems');
  if (cart.length === 0) {
    formBlock.style.display = 'none';
  } else {
    formBlock.style.display = 'block';
    formItems.innerHTML = cart.map(i =>
      `<div class="cart-in-form-item"><span>${i.name} × ${i.qty}</span><span>$${(i.price * i.qty).toLocaleString('es-AR')}</span></div>`
    ).join('');
  }
}

// ── MercadoPago Checkout ──
const BACKEND_URL = 'http://localhost:3001'; // cambiar por URL de Railway en producción

async function checkout() {
  if (cart.length === 0) return;

  const btn = document.getElementById('drawerCheckout');
  btn.textContent = 'Procesando...';
  btn.style.pointerEvents = 'none';

  const nombre = document.getElementById('nombre')?.value?.trim() || '';
  const tel = document.getElementById('tel')?.value?.trim() || '';

  try {
    const res = await fetch(`${BACKEND_URL}/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(i => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
        })),
        payer: { name: nombre, phone: tel },
      }),
    });

    const data = await res.json();
    if (data.initPoint) {
      window.location.href = data.initPoint;
    } else {
      throw new Error('Sin initPoint');
    }
  } catch (err) {
    console.error(err);
    alert('Hubo un error al conectar con el sistema de pagos. Intentá de nuevo o contactanos por WhatsApp.');
    btn.textContent = 'Pagar con MercadoPago';
    btn.style.pointerEvents = '';
  }
}

// ── Leer resultado de pago al volver de MP ──
(function checkPaymentResult() {
  const params = new URLSearchParams(window.location.search);
  const pago = params.get('pago');
  if (!pago) return;

  const msgs = {
    aprobado: '✅ ¡Pago aprobado! Pronto te contactamos para coordinar la entrega.',
    pendiente: '⏳ Pago pendiente. Te avisamos cuando se confirme.',
    error: '❌ El pago no se pudo completar. Intentá de nuevo o escribinos por WhatsApp.',
  };

  if (msgs[pago]) {
    setTimeout(() => {
      const banner = document.createElement('div');
      banner.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);
        background:white;border:1px solid #e0d8f0;padding:16px 28px;border-radius:4px;
        box-shadow:0 4px 24px rgba(0,0,0,0.1);z-index:999;font-size:0.92rem;
        color:#1e1a3c;max-width:90vw;text-align:center;`;
      banner.textContent = msgs[pago];
      document.body.appendChild(banner);
      setTimeout(() => banner.remove(), 6000);
      // limpiar URL
      window.history.replaceState({}, '', window.location.pathname);
      if (pago === 'aprobado') cart = [];
      renderCart();
    }, 500);
  }
})();

// ── Open / close ──
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);
document.getElementById('drawerCheckout').addEventListener('click', closeCart);

// ── Navbar on scroll ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

// ── Form submit → WhatsApp ──
document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const nombre  = document.getElementById('nombre').value.trim();
  const tel     = document.getElementById('tel').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  const itemsText = cart.length
    ? cart.map(i => `${i.name} x${i.qty}`).join(', ')
    : 'sin productos seleccionados';

  const text = encodeURIComponent(
    `Hola, soy ${nombre} (${tel}). Quiero encargar: ${itemsText}.${mensaje ? ' ' + mensaje : ''}`
  );
  window.open(`https://wa.me/5491134687322?text=${text}`, '_blank');
  document.getElementById('formMsg').textContent = 'Te redirigimos a WhatsApp para confirmar el pedido.';
});

// ── Scroll animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── FAQ accordion ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // close all
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ── Modal Caja × 8 ──
let boxSelection = {}; // { id: qty }

function initBoxModal() {
  const overlay = document.getElementById('boxModalOverlay');
  const modal   = document.getElementById('boxModal');
  const openBtn = document.getElementById('openBoxModal');
  const closeBtn= document.getElementById('boxModalClose');
  const addBtn  = document.getElementById('addBoxToCart');
  const container = document.getElementById('modalProducts');
  const counter = document.getElementById('boxCount');

  function totalSelected() {
    return Object.values(boxSelection).reduce((s, q) => s + q, 0);
  }

  function renderModal() {
    const total = totalSelected();
    counter.textContent = total;
    addBtn.disabled = total !== 8;

    container.innerHTML = PRODUCTS.map(p => {
      const qty = boxSelection[p.id] || 0;
      return `
        <div class="modal-product">
          <div>
            <p class="modal-product-name">${p.name}</p>
            <p class="modal-product-detail">${p.desc.split(',').slice(0,1)[0]}</p>
          </div>
          <div class="modal-qty">
            <button class="mqty-btn" onclick="boxChange(${p.id}, -1)" ${qty === 0 ? 'disabled' : ''}>−</button>
            <span class="mqty-val">${qty}</span>
            <button class="mqty-btn" onclick="boxChange(${p.id}, 1)" ${total >= 8 ? 'disabled' : ''}>+</button>
          </div>
        </div>`;
    }).join('');
  }

  window.boxChange = function(id, delta) {
    const current = boxSelection[id] || 0;
    const next = current + delta;
    if (next < 0) return;
    if (delta > 0 && totalSelected() >= 8) return;
    boxSelection[id] = next;
    renderModal();
  };

  openBtn.addEventListener('click', () => {
    boxSelection = {};
    renderModal();
    overlay.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    overlay.classList.remove('open');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  addBtn.addEventListener('click', () => {
    const detalle = PRODUCTS
      .filter(p => boxSelection[p.id] > 0)
      .map(p => `${p.name} ×${boxSelection[p.id]}`)
      .join(', ');

    cart.push({
      id: 'caja-' + Date.now(),
      name: 'Caja × 8',
      desc: detalle,
      price: 20000,
      qty: 1,
      emoji: '□',
    });

    renderCart();
    closeModal();
    openCart();
  });
}

// ── Init ──
renderProducts();
initReveal();
initBoxModal();
