/**
 * Payment result handler — reads URL params after MP redirect.
 */
import * as cart from './cart.js';

const MESSAGES = {
  aprobado: '✅ ¡Pago aprobado! Pronto te contactamos para coordinar la entrega.',
  pendiente: '⏳ Pago pendiente. Te avisamos cuando se confirme.',
  error: '❌ El pago no se pudo completar. Intentá de nuevo o escribinos por WhatsApp.',
};

export function init() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('pago');

  if (!status || !MESSAGES[status]) return;

  showBanner(MESSAGES[status]);
  window.history.replaceState({}, '', window.location.pathname);

  if (status === 'aprobado') cart.clear();
}

function showBanner(message) {
  const banner = document.createElement('div');
  banner.className = 'payment-banner';
  banner.style.cssText = `
    position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
    background: white; border: 1px solid #e0d8f0;
    padding: 16px 28px; z-index: 999;
    box-shadow: 0 4px 24px rgba(0,0,0,.1);
    font-size: .92rem; color: #2a1520;
    max-width: 90vw; text-align: center;
  `;
  banner.textContent = message;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 6000);
}
