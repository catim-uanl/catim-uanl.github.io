/* Menú móvil: abre/cierra el nav y se cierra al elegir un enlace. */
(function () {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("topnav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

/* Scroll reveal: anima con fade + slide-up los elementos marcados con .reveal
   la primera vez que entran en pantalla. Respeta prefers-reduced-motion. */
(function () {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* Botón "volver arriba": aparece tras bajar un tramo y regresa suavemente al inicio. */
(function () {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
