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

  // Solo se descarga el set de fotos del dispositivo actual (desktop O
  // celular, nunca los dos): las <img> nacen sin "src" (solo "data-src").
  // Para que el hero se vea de inmediato (y no se quede en blanco varios
  // segundos esperando ~10 fotos), se descarga primero solo la foto 1 y se
  // arranca el carrusel en cuanto esa llega; el resto del set se sigue
  // descargando en segundo plano, sin bloquear nada (cada foto tiene 5s de
  // margen antes de que le toque salir en la rotación).
  function loadSlide(img) {
    return new Promise((resolve) => {
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener(
        "error",
        () => {
          img.remove();
          resolve();
        },
        { once: true }
      );
      img.src = img.dataset.src;
    });
  }

  const imgs = Array.from(carousel.querySelectorAll(".hero-slide"));
  if (!imgs.length) return;

  loadSlide(imgs[0]).then(start);
  imgs.slice(1).forEach(loadSlide);
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

/* Validación del formulario de contacto: en vez de solo el globo nativo
   del navegador, muestra un mensaje concreto junto a cada campo, mueve el
   foco al primer error y lo limpia en cuanto la persona lo corrige. Corre
   antes que el envío a Google Sheets/FormSubmit y lo bloquea si algo
   falta. */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  function envoltura(campo) {
    return campo.closest(".form-field") || campo.closest("fieldset");
  }

  function mostrarError(campo, mensaje) {
    const wrap = envoltura(campo);
    if (!wrap) return;
    wrap.classList.add("has-error");
    let error = wrap.querySelector(".field-error");
    if (!error) {
      error = document.createElement("p");
      error.className = "field-error";
      error.setAttribute("role", "alert");
      wrap.appendChild(error);
    }
    if (!error.id) error.id = "err-" + Math.random().toString(36).slice(2, 9);
    error.textContent = mensaje;
    if (campo.tagName !== "FIELDSET") {
      campo.setAttribute("aria-invalid", "true");
      campo.setAttribute("aria-describedby", error.id);
    }
  }

  function limpiarError(campo) {
    const wrap = envoltura(campo);
    if (!wrap) return;
    wrap.classList.remove("has-error");
    const error = wrap.querySelector(".field-error");
    if (error) error.remove();
    campo.removeAttribute("aria-invalid");
    campo.removeAttribute("aria-describedby");
  }

  function validar() {
    let primerCampoConError = null;

    const grupoTema = document.getElementById("cf-grupo-tema");
    if (form.querySelector('input[name="Tema"]:checked')) {
      limpiarError(grupoTema);
    } else {
      mostrarError(grupoTema, "Elige una opción.");
      primerCampoConError =
        primerCampoConError || form.querySelector('input[name="Tema"]');
    }

    const nombre = document.getElementById("cf-nombre");
    if (nombre.value.trim()) {
      limpiarError(nombre);
    } else {
      mostrarError(nombre, "Escribe tu nombre.");
      primerCampoConError = primerCampoConError || nombre;
    }

    const correo = document.getElementById("cf-correo");
    const whatsapp = document.getElementById("cf-whatsapp");
    if (document.getElementById("cf-metodo-correo").checked) {
      limpiarError(whatsapp);
      if (correo.value.trim() && correo.checkValidity()) {
        limpiarError(correo);
      } else {
        mostrarError(correo, "Escribe un correo electrónico válido.");
        primerCampoConError = primerCampoConError || correo;
      }
    } else {
      limpiarError(correo);
      if (whatsapp.value.replace(/\D/g, "").length === 10) {
        limpiarError(whatsapp);
      } else {
        mostrarError(whatsapp, "Escribe un número a 10 dígitos.");
        primerCampoConError = primerCampoConError || whatsapp;
      }
    }

    const mensaje = document.getElementById("cf-mensaje");
    if (mensaje.value.trim()) {
      limpiarError(mensaje);
    } else {
      mostrarError(mensaje, "Cuéntanos qué necesitas.");
      primerCampoConError = primerCampoConError || mensaje;
    }

    return primerCampoConError;
  }

  form.addEventListener("submit", function (event) {
    const primerCampoConError = validar();
    if (primerCampoConError) {
      event.preventDefault();
      event.stopImmediatePropagation();
      primerCampoConError.focus();
    }
  });

  form.querySelectorAll("input, textarea").forEach((campo) => {
    const evento = campo.type === "radio" ? "change" : "input";
    campo.addEventListener(evento, () => {
      const wrap = envoltura(campo);
      if (wrap && wrap.classList.contains("has-error")) validar();
    });
  });
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

  let yaSeResolvio = false;
  let esperaDeRespaldo = null;
  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function mostrarConfirmacion() {
    // Puede llamarse dos veces (cuando el fetch resuelve y, si tarda
    // demasiado, cuando se cumple el tiempo de espera de respaldo).
    // Solo debe actuar una vez.
    if (yaSeResolvio) return;
    yaSeResolvio = true;
    clearTimeout(esperaDeRespaldo);

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

  // A diferencia de mostrarConfirmacion(), esto es un fallo de RED real
  // (no la ambigüedad normal de "no-cors"): el formulario sigue visible,
  // el botón se reactiva para reintentar, y se le explica qué pasó en vez
  // de decirle "listo" cuando no se envió nada.
  function mostrarErrorDeRed() {
    if (yaSeResolvio) return;
    yaSeResolvio = true;
    clearTimeout(esperaDeRespaldo);
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar";
    status.textContent =
      "No se pudo enviar por un problema de conexión. Inténtalo de nuevo o escríbenos directamente a angel.rodriguezln@uanl.edu.mx.";
    status.className = "form-status form-status--error";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    yaSeResolvio = false;
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
    // en 3 segundos, asumimos que sí llegó. Un fallo de red genuino (sin
    // internet, DNS, etc.) sí se puede detectar antes de eso, y ahí se
    // avisa de verdad en vez de fingir que se envió.
    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: datos,
    })
      .then(mostrarConfirmacion)
      .catch(mostrarErrorDeRed);

    esperaDeRespaldo = setTimeout(mostrarConfirmacion, 3000);
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

  // Solo anima mientras la pestaña está visible Y el hero está en pantalla:
  // evita gastar batería/CPU dibujando algo que nadie ve.
  let tabVisible = !document.hidden;
  let heroInView = true;

  function sync() {
    if (tabVisible && heroInView) start();
    else stop();
  }

  sync();

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      makeAgents();
    }, 200);
  });

  document.addEventListener("visibilitychange", () => {
    tabVisible = !document.hidden;
    sync();
  });

  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        heroInView = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }
})();

/* Eventos recientes: tarjetas con foto, en una fila que se recorre en
   horizontal (hay lugar para meter todos los que quieras, no solo 3).
   Para agregar/quitar un evento, edita el arreglo EVENTOS de abajo:
   - fecha, titulo, imagen (dentro de /assets)
   - enlace (opcional): a donde lleva la tarjeta al hacer click, por
     ejemplo el post de Facebook de ese evento. Si lo dejas vacio, usa
     la pagina de Facebook del CATIM.
   No depende de internet ni de Facebook para mostrarse: es 100% manual
   por ahora. El formato queda listo para, mas adelante, cambiar el
   arreglo por un fetch("eventos.json") si se conecta una
   sincronizacion automatica con la pagina de Facebook del CATIM. */
(function () {
  const FACEBOOK_CATIM = "https://www.facebook.com/catim.uanl";

  const EVENTOS = [
    {
      fecha: "Julio 2026",
      titulo: "Taller de robótica para niños en el Centro Familiar Amigos San Juan",
      imagen: "assets/im1.jpg",
      enlace: "https://www.facebook.com/share/p/1Bz2scg12Y/",
    },
    {
      fecha: "Julio 2026",
      titulo: "Pedro Guerra obtiene el primer lugar en el Verano de Investigación FIME 2026",
      imagen: "assets/im2.jpg",
      enlace: "https://www.facebook.com/share/p/1EwpuQWvnS/",
    },
    {
      fecha: "Mayo 2026",
      titulo: "El CATIM participa en el Verano de Investigación Científica y Tecnológica FIME 2026",
      imagen: "assets/im3.jpg",
      enlace: "https://www.facebook.com/share/p/18tJTidtH6/",
    },
    {
      fecha: "Mayo 2026",
      titulo: "Ángel Chávez Carrillo defiende tesis de Ingeniería Mecatrónica",
      imagen: "assets/im4.jpg",
      enlace: "https://www.facebook.com/share/p/1Bt3RJfLrX/",
    },
    {
      fecha: "Mayo 2026",
      titulo: "Ángel Nava Way defiende tesis de Ingeniería en Electrónica y Automatización",
      imagen: "assets/im5.jpg",
      enlace: "https://www.facebook.com/share/p/1DFUnSARjL/",
    },
    {
      fecha: "Marzo 2026",
      titulo: "El CATIM presente en el 7.º Congreso de Mecatrónica y Biomédica",
      imagen: "assets/im6.jpg",
      enlace: "https://www.facebook.com/share/p/1DPrxGAyLK/",
    },
    {
      fecha: "Marzo 2026",
      titulo: "El CATIM participa en el Segundo Foro de Ciencia, Tecnología e Innovación PIIT 2026",
      imagen: "assets/im7.jpg",
      enlace: "https://www.facebook.com/share/p/1dbb8PDK1g/",
    },
    {
      fecha: "Marzo 2026",
      titulo: "Exposición de robótica para el Taller CAST en UANL-SKYE Group",
      imagen: "assets/im8.jpg",
      enlace: "https://www.facebook.com/share/p/18iXSFt2YW/",
    },
    {
      fecha: "Febrero 2026",
      titulo: "Estancia doctoral en Francia: ciencia sin fronteras",
      imagen: "assets/im9.jpg",
      enlace: "https://www.facebook.com/share/p/1HCVDLkVxc/",
    },
    {
      fecha: "Diciembre 2025",
      titulo: "Seminario sobre monitoreo de contaminación atmosférica con drones (UAV)",
      imagen: "assets/im10.jpg",
      enlace: "https://www.facebook.com/share/p/1PbZfz1Zar/",
    },
  ];

  const grid = document.getElementById("eventoGrid");
  const toolbar = document.getElementById("eventToolbar");
  const prevBtn = document.getElementById("eventPrev");
  const nextBtn = document.getElementById("eventNext");
  if (!grid) return;

  if (!EVENTOS.length) {
    grid.innerHTML =
      '<p class="event-empty">Próximamente: fotos de nuestras actividades más recientes.</p>';
    if (toolbar) toolbar.style.display = "none";
    return;
  }

  grid.innerHTML = EVENTOS.map(
    (ev) => `
    <a class="event-card reveal" href="${ev.enlace || FACEBOOK_CATIM}" target="_blank" rel="noopener">
      <div class="event-photo"><img src="${ev.imagen}" alt="" loading="lazy"></div>
      <div class="event-body">
        <span class="event-date">${ev.fecha}</span>
        <h3>${ev.titulo}</h3>
      </div>
    </a>
  `
  ).join("");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* Botones sutiles para recorrer los eventos con el scroll horizontal. */
  if (prevBtn && nextBtn) {
    const cardStep = () => {
      const card = grid.querySelector(".event-card");
      const gap = parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap) || 0;
      return card ? card.getBoundingClientRect().width + gap : 300;
    };
    const updateNavState = () => {
      const maxScroll = grid.scrollWidth - grid.clientWidth - 1;
      prevBtn.disabled = grid.scrollLeft <= 0;
      nextBtn.disabled = maxScroll <= 0 || grid.scrollLeft >= maxScroll;
    };
    const scrollByStep = (dir) => {
      grid.scrollBy({
        left: dir * cardStep(),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };
    prevBtn.addEventListener("click", () => scrollByStep(-1));
    nextBtn.addEventListener("click", () => scrollByStep(1));
    grid.addEventListener("scroll", updateNavState);
    window.addEventListener("resize", updateNavState);
    updateNavState();
  }

  const cards = grid.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const eventObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          eventObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  cards.forEach((el) => eventObserver.observe(el));
})();
