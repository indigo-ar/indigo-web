/**
 * FAQ accordion — accessible with aria-expanded.
 */
export function init() {
  document.querySelectorAll('.faq__question').forEach((btn) => {
    btn.addEventListener('click', () => toggle(btn));
  });
}

function toggle(btn) {
  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  // Close all
  document.querySelectorAll('.faq__question').forEach((b) => {
    b.setAttribute('aria-expanded', 'false');
    b.nextElementSibling?.classList.remove('faq__answer--open');
  });

  // Open clicked (if it was closed)
  if (!isOpen) {
    btn.setAttribute('aria-expanded', 'true');
    btn.nextElementSibling?.classList.add('faq__answer--open');
  }
}
