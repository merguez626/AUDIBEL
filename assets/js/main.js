/* ==========================================================================
   AUDIOBEL — script global
   Header sticky, progression de lecture, nav mobile, lien actif,
   reveal-on-scroll, retour en haut, année du footer.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  /* ---------- Header sticky + progression + back-to-top ---------- */
  function initScrollUI() {
    const header = $(".site-header");
    const progress = $(".scroll-progress");
    const backToTop = $(".back-to-top");
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 12);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
      if (backToTop) backToTop.classList.toggle("visible", y > 600);
      ticking = false;
    };

    update();
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  /* ---------- Lien actif selon data-page ---------- */
  function initActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    $$(".nav-link").forEach((link) => {
      const active = link.dataset.page === page;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
    });
  }

  /* ---------- Menu mobile ---------- */
  const MOBILE_BP = 1140;
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

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      close();
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

  /* ---------- Reveal on scroll (cascade) ---------- */
  function initReveal() {
    const nodes = $$(".reveal");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("visible"));
      return;
    }

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
        n.style.setProperty("--delay", `${Math.min((i % 4) * 70, 240)}ms`);
      }
      obs.observe(n);
    });
  }

  /* ---------- Année du footer ---------- */
  function initFooterYear() {
    $$("[data-current-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    initScrollUI();
    initActiveNav();
    initMenu();
    initFooterYear();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
