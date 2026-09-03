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
  const more = document.getElementById("pubMore");
  if (!toggle || !more) return;

  toggle.addEventListener("click", () => {
    const isOpen = more.classList.toggle("is-open");
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
  if (!form || !status || !submitBtn) return;

  const endpointConfigurado =
    GOOGLE_SHEETS_ENDPOINT.startsWith("https://script.google.com/");
  if (!endpointConfigurado) return; // usa el respaldo por correo (FormSubmit)

  function bloquearFormulario() {
    // Deja todo el formulario deshabilitado hasta que se recargue la
    // página, para que no se pueda enviar una segunda respuesta.
    Array.prototype.forEach.call(form.elements, function (campo) {
      campo.disabled = true;
    });
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

    fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: datos,
    })
      .then(function () {
        // "no-cors" no permite leer la respuesta real, así que asumimos
        // éxito si la petición no lanzó un error de red.
        status.textContent = "¡Gracias! Tu mensaje se envió correctamente.";
        status.className = "form-status form-status--ok";
        submitBtn.hidden = true;
        bloquearFormulario();
      })
      .catch(function () {
        status.textContent =
          "No se pudo enviar. Por favor intenta de nuevo o escribe a angel.rodriguezln@uanl.edu.mx.";
        status.className = "form-status form-status--error";
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar";
      });
  });
})();
