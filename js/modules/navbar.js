/**
 * Navbar module — handles scroll state.
 */
const SCROLL_THRESHOLD = 60;

export function init() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const isLight = navbar.classList.contains('navbar--light');

  const update = () => {
    const scrolled = window.scrollY > SCROLL_THRESHOLD;
    navbar.classList.toggle('navbar--scrolled', scrolled);
    if (isLight) navbar.classList.toggle('navbar--light', !scrolled);
  };

  window.addEventListener('scroll', update, { passive: true });
  update(); // run on load
}
