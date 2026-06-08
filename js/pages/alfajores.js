/**
 * Alfajores page — bootstraps all modules.
 * Single entry point loaded as <script type="module">.
 */
import { init as initNavbar }        from '../modules/navbar.js';
import { init as initAnimations }    from '../modules/animations.js';
import { init as initProducts }      from '../modules/products.js';
import { init as initBoxModal }      from '../modules/boxModal.js';
import { init as initCartUI }        from '../modules/cartUI.js';
import { init as initFaq }           from '../modules/faq.js';
import { init as initOrderForm }     from '../modules/orderForm.js';
import { init as initPaymentResult } from '../modules/paymentResult.js';

// Cart trigger button
import * as cartUI from '../modules/cartUI.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimations();
  initProducts();
  initBoxModal();
  initCartUI();
  initFaq();
  initOrderForm();
  initPaymentResult();

  // Cart button in navbar
  document.getElementById('cartBtn')
    ?.addEventListener('click', cartUI.open);
});
