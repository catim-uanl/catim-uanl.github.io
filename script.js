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

/* Carrusel del hero: cambia de foto automáticamente cada 5s con fundido.
   Si una foto (f1.jpg ... f10.jpg, o m1.jpg ... m10.jpg en celular) no
   existe todavía, su <img> se autoelimina (ver onerror en el HTML) y el
   carrusel simplemente la salta.
   En pantallas de hasta 700px de ancho usa el set de fotos "m" (pensado
   para celular); en pantallas más anchas usa el set "f" (computadora).
   Respeta prefers-reduced-motion (deja la primera foto fija, sin autoplay). */
(function () {
  const esCelular = window.matchMedia("(max-width: 700px)").matches;
  const carousel = document.querySelector(
    esCelular ? ".hero-carousel--mobile" : ".hero-carousel--desktop"
  );
  const dotsWrap = document.getElementById("heroDots");
  if (!carousel) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let slides = [];
  let dots = [];
  let current = 0;
  let timer = null;

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ir a la foto " + (i + 1));
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
      return b;
    });
  }

  function goTo(index) {
    if (!slides.length) return;
    slides[current].classList.remove("is-active");
    if (dots[current]) dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    if (dots[current]) dots[current].classList.add("is-active");
  }

  function next() {
    goTo(current + 1);
  }

  function start() {
    slides = Array.from(carousel.querySelectorAll(".hero-slide"));
    if (!slides.length) return;
    buildDots();
    slides[0].classList.add("is-active");
    if (dots[0]) dots[0].classList.add("is-active");
    if (slides.length > 1 && !prefersReducedMotion) {
      timer = setInterval(next, 5000);
      carousel.addEventListener("mouseenter", () => clearInterval(timer));
      carousel.addEventListener("mouseleave", () => {
        timer = setInterval(next, 5000);
      });
    }
  }

  // Da un pequeño margen para que las imágenes rotas (onerror) ya se hayan
  // quitado del DOM antes de armar el carrusel y los puntos.
  window.addEventListener("load", () => setTimeout(start, 50));
})();

/* Publicaciones destacadas: botón para mostrar/ocultar las siguientes. */
(function () {
  const toggle = document.getElementById("pubToggle");
  const wrap = document.getElementById("pubMoreWrap");
  if (!toggle || !wrap) return;

  toggle.addEventListener("click", () => {
    const isOpen = wrap.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen
      ? "Ver menos publicaciones"
      : "Ver 5 publicaciones más";
  });
})();

/* Formulario de contacto: muestra el campo de correo o de WhatsApp
   según el método de contacto que elija la persona, y marca el campo
   que no se usa como no-requerido para que el envío no se bloquee. */
(function () {
  const correoRadio = document.getElementById("cf-metodo-correo");
  const whatsappRadio = document.getElementById("cf-metodo-whatsapp");
  const campoCorreo = document.getElementById("cf-campo-correo");
  const campoWhatsapp = document.getElementById("cf-campo-whatsapp");
  if (!correoRadio || !whatsappRadio || !campoCorreo || !campoWhatsapp) return;

  const inputCorreo = campoCorreo.querySelector("input");
  const inputWhatsapp = campoWhatsapp.querySelector("input");

  function actualizar() {
    const usaCorreo = correoRadio.checked;
    campoCorreo.hidden = !usaCorreo;
    campoWhatsapp.hidden = usaCorreo;
    if (inputCorreo) inputCorreo.required = usaCorreo;
    if (inputWhatsapp) inputWhatsapp.required = !usaCorreo;
  }

  correoRadio.addEventListener("change", actualizar);
  whatsappRadio.addEventListener("change", actualizar);
  actualizar();
})();

/* Envío del formulario a Google Sheets a través de un Google Apps Script
   publicado como "aplicación web". Mientras GOOGLE_SHEETS_ENDPOINT tenga el
   valor de ejemplo, el formulario usa el envío normal (por correo, vía
   FormSubmit, configurado en el atributo action del <form>) como respaldo.
   En cuanto se reemplace por la URL real de tu Apps Script, el formulario
   empieza a guardar cada respuesta como una fila nueva en tu Google Sheets. */
(function () {
  const GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxPUclOTfjANU_zeQ6kb4glaQrIp02EjcCP2Unob-mNWKsvgomdajlS7XK8g-e-3YXJVQ/exec";

  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactFormStatus");
  const submitBtn = document.getElementById("contactFormSubmit");
  const confirmacion = document.getElementById("contactFormConfirmation");
  if (!form || !status || !submitBtn || !confirmacion) return;

  const endpointConfigurado =
    GOOGLE_SHEETS_ENDPOINT.startsWith("https://script.google.com/");
  if (!endpointConfigurado) return; // usa el respaldo por correo (FormSubmit)

  let yaSeMostroConfirmacion = false;
  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function mostrarConfirmacion() {
    // Puede llamarse dos veces (cuando el fetch resuelve y, si tarda
    // demasiado, cuando se cumple el tiempo de espera de respaldo).
    // Solo debe actuar una vez.
    if (yaSeMostroConfirmacion) return;
    yaSeMostroConfirmacion = true;

    if (prefiereMenosMovimiento) {
      form.hidden = true;
      confirmacion.hidden = false;
      return;
    }

    // Se desvanece el formulario (200ms, ver .form-fading en styles.css)
    // y, al terminar, se intercambia por la confirmación, que entra con
    // su propia animación (@keyframes confirmIn).
    form.classList.add("form-fading");
    window.setTimeout(() => {
      form.hidden = true;
      confirmacion.hidden = false;
    }, 200);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";
    status.textContent = "";
    status.className = "form-status";

    // Se manda como application/x-www-form-urlencoded (vía URLSearchParams)
    // en vez de FormData/multipart: es el formato que Google Apps Script
    // interpreta de forma más confiable en "e.parameter".
    const datos = new URLSearchParams(new FormData(form));

    // Con "no-cors" el navegador no deja leer la respuesta real, y en la
    // práctica el fetch a veces nunca "resuelve" del todo aunque el dato
    // ya haya llegado a la hoja (por cómo Google redirige la respuesta).
    // Por eso no dependemos solo de que el fetch termine: si no resuelve
    // en 3 segundos, mostramos la confirmación de todos modos.
    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: datos,
    })
      .then(mostrarConfirmacion)
      .catch(mostrarConfirmacion);

    setTimeout(mostrarConfirmacion, 3000);
  });
})();

/* Enjambre del hero: una simulación mínima de repulsión-atracción-influencia
   (el mismo principio detrás de la línea de investigación en robótica de
   enjambres del CATIM) dibujada en un <canvas>, como firma visual del sitio.
   No decorativa al azar: son agentes reales con reglas reales, muy suaves,
   detrás de las fotos del carrusel. Se detiene por completo si el sistema
   pide menos movimiento, o si la pestaña no está visible. */
(function () {
  const canvas = document.getElementById("heroSwarm");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const AGENT_COUNT = 34;
  const NEIGHBOR_RADIUS = 90;
  const REPEL_RADIUS = 34;
  const MAX_SPEED = 0.35;
  const LINK_OPACITY = 0.09;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let agents = [];
  let frameId = null;
  let running = false;

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeAgents() {
    agents = Array.from({ length: AGENT_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * MAX_SPEED,
      vy: (Math.random() - 0.5) * MAX_SPEED,
    }));
  }

  function step() {
    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      let repelX = 0, repelY = 0;
      let alignX = 0, alignY = 0;
      let cohereX = 0, cohereY = 0;
      let neighbors = 0;

      for (let j = 0; j < agents.length; j++) {
        if (i === j) continue;
        const b = agents[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

        if (dist < REPEL_RADIUS) {
          // repulsión: no chocar con el vecino
          repelX += dx / dist;
          repelY += dy / dist;
        }
        if (dist < NEIGHBOR_RADIUS) {
          // influencia: alinear rumbo con vecinos cercanos
          alignX += b.vx;
          alignY += b.vy;
          // atracción: no dispersarse del grupo
          cohereX += b.x;
          cohereY += b.y;
          neighbors++;
        }
      }

      if (neighbors > 0) {
        alignX /= neighbors;
        alignY /= neighbors;
        cohereX = cohereX / neighbors - a.x;
        cohereY = cohereY / neighbors - a.y;
      }

      a.vx += repelX * 0.02 + alignX * 0.02 + cohereX * 0.0006;
      a.vy += repelY * 0.02 + alignY * 0.02 + cohereY * 0.0006;

      const speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy) || 0.001;
      if (speed > MAX_SPEED) {
        a.vx = (a.vx / speed) * MAX_SPEED;
        a.vy = (a.vy / speed) * MAX_SPEED;
      }

      a.x += a.vx;
      a.y += a.vy;

      // bordes suaves: reaparece del otro lado en vez de rebotar
      if (a.x < -10) a.x = width + 10;
      if (a.x > width + 10) a.x = -10;
      if (a.y < -10) a.y = height + 10;
      if (a.y > height + 10) a.y = -10;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(239, 240, 236, " + LINK_OPACITY + ")";
    ctx.lineWidth = 1;
    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const a = agents[i];
        const b = agents[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < NEIGHBOR_RADIUS) {
          ctx.globalAlpha = 1 - dist / NEIGHBOR_RADIUS;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(239, 240, 236, 0.55)";
    for (const a of agents) {
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!running) return;
    step();
    draw();
    frameId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    frameId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = null;
  }

  resize();
  makeAgents();
  start();

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      makeAgents();
    }, 200);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
})();
