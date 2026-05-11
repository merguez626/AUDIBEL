/* ==========================================================================
   AUDIOBEL · script global (header sticky, nav mobile, reveal-on-scroll)
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
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
