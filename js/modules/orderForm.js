/**
 * Order form — guarda el pedido en la DB y abre WhatsApp.
 */
import * as cart from './cart.js';
import { WHATSAPP_NUMBER, BACKEND_URL } from '../config/products.js';
import { buildWhatsAppURL } from './utils.js';

export function init() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  form.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();

  const nombre  = document.getElementById('nombre')?.value.trim() ?? '';
  const tel     = document.getElementById('tel')?.value.trim() ?? '';
  const mensaje = document.getElementById('mensaje')?.value.trim() ?? '';
  const msgEl   = document.getElementById('formMsg');
  const btn     = e.target.querySelector('button[type="submit"]');

  if (!nombre || !tel) {
    if (msgEl) msgEl.textContent = 'Por favor completá tu nombre y WhatsApp.';
    return;
  }

  // Guardar en DB
  if (!cart.isEmpty()) {
    try {
      btn.disabled = true;
      if (msgEl) msgEl.textContent = 'Guardando pedido...';

      await fetch(`${BACKEND_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          whatsapp: tel,
          productos: cart.getItems().map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
          total: cart.getTotal(),
          notas: mensaje || null,
        }),
      });
    } catch (err) {
      console.warn('No se pudo guardar el pedido en la DB:', err);
      // Igual continúa con WhatsApp aunque falle la DB
    } finally {
      btn.disabled = false;
    }
  }

  // Abrir WhatsApp
  const itemsText = cart.isEmpty()
    ? 'sin productos seleccionados'
    : cart.getItems().map((i) => `${i.name} x${i.qty}`).join(', ');

  const text = `Hola, soy ${nombre} (${tel}). Quiero encargar: ${itemsText}.${mensaje ? ' ' + mensaje : ''}`;
  window.open(buildWhatsAppURL(WHATSAPP_NUMBER, text), '_blank');

  if (msgEl) msgEl.textContent = 'Te redirigimos a WhatsApp para confirmar el pedido.';
}
