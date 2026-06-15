/**
 * Scroll reveal animations using IntersectionObserver.
 * Elements with class "reveal" fade in when they enter the viewport.
 * Elements with class "count-up" animate their numeric content on reveal.
 */

const STAGGER_MS = 80;

export function init() {
  initReveal();
  initCountUp();
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(
          () => entry.target.classList.add('reveal--visible'),
          i * STAGGER_MS,
        );
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );

  elements.forEach((el) => observer.observe(el));
}

function initCountUp() {
  const elements = document.querySelectorAll('.count-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  elements.forEach((el) => observer.observe(el));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.target ?? el.textContent, 10);
  const duration = 1200;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
