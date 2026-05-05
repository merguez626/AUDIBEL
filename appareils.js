/* ==========================================================================
   AUDIOBEL · Catalogue (appareils.html)
   ========================================================================== */

(function () {
  "use strict";

  const devices = Array.isArray(window.AUDIOBEL_DEVICES) ? window.AUDIOBEL_DEVICES : [];
  const grid = document.getElementById("devices-catalog-grid");
  const filterButtons = [...document.querySelectorAll(".filter-chip")];
  const meta = document.getElementById("catalog-count");

  const placeholderImage = (name) =>
    (window.AUDIOBEL && window.AUDIOBEL.placeholderImage)
      ? window.AUDIOBEL.placeholderImage(name)
      : "";

  function render() {
    if (!grid) return;
    if (!devices.length) {
      grid.innerHTML = `<p class="muted">Aucun appareil n'est configuré.</p>`;
      return;
    }
    const frag = document.createDocumentFragment();
    devices.forEach((d, i) => {
      const placement = d.placement === "interne" ? "interne" : "externe";
      const link = document.createElement("a");
      link.className = "device-slide reveal";
      link.href = `appareil.html?slug=${encodeURIComponent(d.slug)}`;
      link.dataset.placement = placement;
      link.style.setProperty("--delay", `${Math.min(i * 50, 280)}ms`);
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
      frag.appendChild(link);
    });
    grid.appendChild(frag);

    if (window.AUDIOBEL && window.AUDIOBEL.revealNew) {
      window.AUDIOBEL.revealNew(grid);
    }
  }

  function applyFilter(filter) {
    if (!grid) return;
    const items = [...grid.querySelectorAll(".device-slide")];
    let visible = 0;
    items.forEach((item) => {
      const ok = filter === "all" || item.dataset.placement === filter;
      item.classList.toggle("is-hidden", !ok);
      if (ok) visible++;
    });
    if (meta) {
      meta.textContent = `${visible} appareil${visible > 1 ? "s" : ""} affiché${visible > 1 ? "s" : ""} sur ${items.length}`;
    }
  }

  function initFilters() {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
        applyFilter(btn.dataset.filter || "all");
      });
    });
  }

  function init() {
    render();
    initFilters();
    applyFilter("all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
