/**
 * Navbar module — handles scroll state.
 */
const SCROLL_THRESHOLD = 60;

export function init() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // run on load
}
