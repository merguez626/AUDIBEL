/* ==========================================================================
   AUDIOBEL · Fiche appareil (appareil.html)
   ========================================================================== */

(function () {
  "use strict";

  const devices = Array.isArray(window.AUDIOBEL_DEVICES) ? window.AUDIOBEL_DEVICES : [];

  const titleNode = document.getElementById("device-title");
  const tagNode = document.getElementById("device-category");
  const descriptionNode = document.getElementById("device-description");
  const highlightsNode = document.getElementById("device-highlights");
  const imageNode = document.getElementById("device-image");
  const placementNode = document.getElementById("device-placement");
  const breadcrumbNode = document.getElementById("breadcrumb-current");
  const relatedNode = document.getElementById("related-devices");

  const placeholderImage = (name) =>
    (window.AUDIOBEL && window.AUDIOBEL.placeholderImage)
      ? window.AUDIOBEL.placeholderImage(name)
      : "";

  function resolveDevice() {
    if (!devices.length) return null;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    return devices.find((d) => d.slug === slug) || devices[0];
  }

  function render(device) {
    if (!device) {
      if (titleNode) titleNode.textContent = "Aucun appareil configuré";
      if (descriptionNode) descriptionNode.textContent = "Ajoutez vos appareils dans devices-data.js.";
      return;
    }

    document.title = `AUDIOBEL | ${device.name}`;
    if (titleNode) titleNode.textContent = device.name;
    if (tagNode) tagNode.textContent = device.category;
    if (descriptionNode) descriptionNode.textContent = device.details || device.description;
    if (breadcrumbNode) breadcrumbNode.textContent = device.name;
    if (placementNode) {
      placementNode.textContent = device.placement === "interne" ? "Intra-auriculaire" : "Contour d'oreille";
    }

    if (highlightsNode) {
      highlightsNode.innerHTML = "";
      (device.highlights || []).forEach((h) => {
        const li = document.createElement("li");
        li.textContent = h;
        highlightsNode.appendChild(li);
      });
    }

    if (imageNode) {
      imageNode.src = device.image;
      imageNode.alt = device.name;
      imageNode.addEventListener("error", () => {
        imageNode.src = placeholderImage(device.name);
      }, { once: true });
    }

    renderRelated(device);
  }

  function renderRelated(current) {
    if (!relatedNode) return;
    const others = devices.filter((d) => d.slug !== current.slug).slice(0, 3);
    const frag = document.createDocumentFragment();
    others.forEach((d, i) => {
      const link = document.createElement("a");
      link.className = "device-slide reveal";
      link.href = `appareil.html?slug=${encodeURIComponent(d.slug)}`;
      link.style.setProperty("--delay", `${i * 80}ms`);
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
    relatedNode.appendChild(frag);
    if (window.AUDIOBEL && window.AUDIOBEL.revealNew) {
      window.AUDIOBEL.revealNew(relatedNode);
    }
  }

  function init() {
    render(resolveDevice());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
