/**
 * Order form — builds and sends the WhatsApp message on submit.
 */
import * as cart from './cart.js';
import { WHATSAPP_NUMBER } from '../config/products.js';
import { buildWhatsAppURL } from './utils.js';

export function init() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  form.addEventListener('submit', handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();

  const nombre  = document.getElementById('nombre')?.value.trim() ?? '';
  const tel     = document.getElementById('tel')?.value.trim() ?? '';
  const mensaje = document.getElementById('mensaje')?.value.trim() ?? '';

  const itemsText = cart.isEmpty()
    ? 'sin productos seleccionados'
    : cart.getItems().map((i) => `${i.name} x${i.qty}`).join(', ');

  const text = `Hola, soy ${nombre} (${tel}). Quiero encargar: ${itemsText}.${mensaje ? ' ' + mensaje : ''}`;

  window.open(buildWhatsAppURL(WHATSAPP_NUMBER, text), '_blank');

  const msgEl = document.getElementById('formMsg');
  if (msgEl) msgEl.textContent = 'Te redirigimos a WhatsApp para confirmar el pedido.';
}
