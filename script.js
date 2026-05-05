/* ==========================================================================
   AUDIOBEL · script global (header, nav, reveal, carousel)
   ========================================================================== */

(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const onIdle = (cb) => (window.requestIdleCallback ? requestIdleCallback(cb) : setTimeout(cb, 1));

  /* ---------- Header sticky shadow ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    let ticking = false;
    const update = () => {
      header.classList.toggle("scrolled", window.scrollY > 12);
      ticking = false;
    };
    update();
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ---------- Active nav link from data-page ---------- */
  function initActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    $$(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.page === page);
    });
  }

  /* ---------- Mobile menu ---------- */
  const MOBILE_BP = 980;
  function initMenu() {
    const toggle = $(".menu-toggle");
    const nav = $(".main-nav");
    if (!toggle || !nav) return;

    const close = () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    };
    const open = () => {
      nav.classList.add("open");
      toggle.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-open");
    };

    toggle.addEventListener("click", () => {
      nav.classList.contains("open") ? close() : open();
    });
    $$(".nav-link", nav).forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= MOBILE_BP) close();
      });
    });
    let resizeRaf;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        if (window.innerWidth > MOBILE_BP) close();
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const nodes = $$(".reveal");
    if (!nodes.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    nodes.forEach((n, i) => {
      if (!n.style.getPropertyValue("--delay")) {
        n.style.setProperty("--delay", `${Math.min(i * 60, 240)}ms`);
      }
      obs.observe(n);
    });
  }

  /* ---------- Devices carousel (homepage / solutions) ---------- */
  function placeholderImage(name) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'>
      <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
        <stop offset='0%' stop-color='#fbeef3'/><stop offset='100%' stop-color='#ffffff'/>
      </linearGradient></defs>
      <rect fill='url(#g)' width='640' height='480'/>
      <circle cx='480' cy='100' r='90' fill='#f3cdda' opacity='0.5'/>
      <text x='50%' y='50%' text-anchor='middle' font-size='28' fill='#8d173f' font-family='Sora,sans-serif'>${name}</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function initDevicesCarousel() {
    const track = $("#devices-carousel-track");
    const carousel = $("#devices-carousel");
    if (!track || !carousel) return;

    const devices = (window.AUDIOBEL_DEVICES || []).slice(0, 6);
    if (!devices.length) {
      track.innerHTML = `<p class="muted">Aucun appareil n'est configuré pour le moment.</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    devices.forEach((d) => {
      const link = document.createElement("a");
      link.className = "device-slide";
      link.href = `appareil.html?slug=${encodeURIComponent(d.slug)}`;
      link.setAttribute("aria-label", `Voir la fiche ${d.name}`);
      link.innerHTML = `
        <article class="device-card">
          <div class="device-image-wrap">
            <img src="${d.image}" alt="${d.name}" loading="lazy">
          </div>
          <div class="device-content">
            <div class="device-topline">
              <h3>${d.name}</h3>
              <span class="tag">${d.category}</span>
            </div>
            <p>${d.description}</p>
            <span class="device-cta">Voir la fiche</span>
          </div>
        </article>`;
      const img = link.querySelector("img");
      img.addEventListener("error", () => { img.src = placeholderImage(d.name); }, { once: true });
      fragment.appendChild(link);
    });
    track.appendChild(fragment);

    /* Dots */
    const dotsBox = $("#carousel-dots");
    const dots = [];
    if (dotsBox) {
      devices.forEach((d, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Aller à ${d.name}`);
        dot.addEventListener("click", () => goTo(i));
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
      if (dots[0]) dots[0].classList.add("active");
    }

    const prevBtn = $('[data-carousel="prev"]');
    const nextBtn = $('[data-carousel="next"]');

    const stepWidth = () => {
      const slide = track.querySelector(".device-slide");
      if (!slide) return 0;
      const gap = parseFloat(getComputedStyle(track).gap || "0");
      return slide.getBoundingClientRect().width + gap;
    };
    const activeIndex = () => {
      const step = stepWidth();
      if (step <= 0) return 0;
      return Math.round(carousel.scrollLeft / step);
    };
    const goTo = (i) => {
      const step = stepWidth();
      const max = devices.length - 1;
      const clamped = Math.max(0, Math.min(i, max));
      carousel.scrollTo({ left: clamped * step, behavior: "smooth" });
    };

    if (prevBtn) prevBtn.addEventListener("click", () => goTo(activeIndex() - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => goTo(activeIndex() + 1));

    let raf;
    carousel.addEventListener("scroll", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = activeIndex();
        dots.forEach((dot, idx) => dot.classList.toggle("active", idx === i));
      });
    }, { passive: true });
  }

  /* ---------- Year in footer ---------- */
  function initFooterYear() {
    const el = $("[data-current-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Boot ---------- */
  function init() {
    initHeader();
    initActiveNav();
    initMenu();
    initFooterYear();
    onIdle(() => {
      initReveal();
      initDevicesCarousel();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Expose helpers for catalog / detail pages */
  window.AUDIOBEL = Object.assign(window.AUDIOBEL || {}, {
    placeholderImage,
    revealNew(scope) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      $$(".reveal", scope || document).forEach((n) => obs.observe(n));
    },
  });
})();
