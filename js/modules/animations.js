/**
 * Scroll reveal animations using IntersectionObserver.
 * Elements with class "reveal" fade in when they enter the viewport.
 */

const STAGGER_MS = 80;

export function init() {
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
