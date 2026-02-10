const devices = Array.isArray(window.AUDIBEL_DEVICES) ? window.AUDIBEL_DEVICES : [];

const titleNode = document.getElementById("device-title");
const categoryNode = document.getElementById("device-category");
const descriptionNode = document.getElementById("device-description");
const highlightsNode = document.getElementById("device-highlights");
const imageNode = document.getElementById("device-image");
const captionNode = document.getElementById("device-caption");

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

function resolveDevice() {
  if (!devices.length) {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  return devices.find((item) => item.slug === slug) || devices[0];
}

function renderDevice(device) {
  if (!device) {
    titleNode.textContent = "Aucun appareil configure";
    categoryNode.textContent = "Information";
    descriptionNode.textContent = "Ajoutez vos appareils dans devices-data.js.";
    highlightsNode.innerHTML = "";
    imageNode.src = placeholderImage("AUDIBEL");
    imageNode.alt = "Aucun appareil configure";
    return;
  }

  document.title = `AUDIBEL | ${device.name}`;
  titleNode.textContent = device.name;
  categoryNode.textContent = device.category;
  descriptionNode.textContent = device.details;
  captionNode.textContent = `${device.name} - ${device.category}`;

  const highlights = Array.isArray(device.highlights) ? device.highlights : [];
  highlightsNode.innerHTML = "";
  highlights.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    highlightsNode.appendChild(item);
  });

  imageNode.src = device.image;
  imageNode.alt = device.name;
  imageNode.addEventListener("error", () => {
    imageNode.src = placeholderImage(device.name);
  }, { once: true });
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
  renderDevice(resolveDevice());
  initReveal();
}

init();
