const devices = Array.isArray(window.AUDIBEL_DEVICES) ? window.AUDIBEL_DEVICES : [];
const catalogGrid = document.getElementById("devices-catalog-grid");
const filterButtons = [...document.querySelectorAll(".catalog-filter")];
const catalogCount = document.getElementById("catalog-count");
let catalogItems = [];

function placeholderImage(name) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 400'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stop-color='#f4e4ec'/>
          <stop offset='100%' stop-color='#fff9fc'/>
        </linearGradient>
      </defs>
      <rect fill='url(#g)' width='640' height='400'/>
      <circle cx='530' cy='95' r='80' fill='#f0c8d8' opacity='0.45'/>
      <circle cx='96' cy='298' r='120' fill='#eeb5cb' opacity='0.35'/>
      <text x='50%' y='47%' text-anchor='middle' font-size='30' fill='#8d173f' font-family='Sora, sans-serif'>Image a fournir</text>
      <text x='50%' y='58%' text-anchor='middle' font-size='21' fill='#704258' font-family='Work Sans, sans-serif'>${name}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderCatalog() {
  if (!catalogGrid) {
    return;
  }

  if (!devices.length) {
    catalogGrid.innerHTML = "<p>Aucun appareil n'est configure pour le moment.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();

  devices.forEach((device, index) => {
    const placement = device.placement === "interne" ? "interne" : "externe";
    const link = document.createElement("a");
    link.className = "device-catalog-item reveal";
    link.href = `appareil.html?slug=${encodeURIComponent(device.slug)}`;
    link.style.setProperty("--delay", `${Math.min(index * 24, 220)}ms`);
    link.setAttribute("aria-label", `Voir ${device.name}`);
    link.setAttribute("data-placement", placement);

    link.innerHTML = `
      <article class="device-card">
        <div class="device-image-wrap">
          <img src="${device.image}" alt="${device.name}" loading="lazy">
        </div>
        <div class="device-content">
          <div class="device-topline">
            <h3>${device.name}</h3>
            <span class="device-tag">${device.category}</span>
          </div>
          <p>${device.description}</p>
          <span class="device-cta">Voir la page dediee</span>
        </div>
      </article>
    `;

    const image = link.querySelector("img");
    image.addEventListener("error", () => {
      image.src = placeholderImage(device.name);
    }, { once: true });

    fragment.appendChild(link);
  });

  catalogGrid.appendChild(fragment);
  catalogItems = [...catalogGrid.querySelectorAll(".device-catalog-item")];
}

function updateCatalogCount(visibleCount) {
  if (!catalogCount) {
    return;
  }

  const total = catalogItems.length;
  catalogCount.textContent = `${visibleCount} appareil(s) affiche(s) sur ${total}`;
}

function applyFilter(filter) {
  if (!catalogItems.length) {
    updateCatalogCount(0);
    return;
  }

  let visibleCount = 0;
  catalogItems.forEach((item) => {
    const placement = item.getAttribute("data-placement");
    const isVisible = filter === "all" || placement === filter;
    item.classList.toggle("is-hidden", !isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  });

  updateCatalogCount(visibleCount);
}

function initFilters() {
  if (!filterButtons.length) {
    return;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter") || "all";
      filterButtons.forEach((node) => node.classList.toggle("active", node === button));
      applyFilter(filter);
    });
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        instance.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function init() {
  renderCatalog();
  initFilters();
  applyFilter("all");
  initReveal();
}

init();
