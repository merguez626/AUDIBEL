const devices = [
  {
    name: "AUDIBEL Pure Air 1",
    category: "Intra discret",
    description: "Format mini et confortable pour une utilisation quotidienne en toute discretion.",
    image: "images/appareil-01.jpg"
  },
  {
    name: "AUDIBEL Move Pro 2",
    category: "Contour d'oreille",
    description: "Qualite sonore stable, reduction du bruit et excellente autonomie.",
    image: "images/appareil-02.jpg"
  },
  {
    name: "AUDIBEL Clarity 3",
    category: "Rechargeable",
    description: "Recharge rapide et ecoute naturelle pour la conversation en environnement calme.",
    image: "images/appareil-03.jpg"
  },
  {
    name: "AUDIBEL Connect 4",
    category: "Bluetooth",
    description: "Connexion smartphone pour appels et medias avec reglages simples.",
    image: "images/appareil-04.jpg"
  },
  {
    name: "AUDIBEL Daily Fit 5",
    category: "Confort",
    description: "Concu pour un port prolonge avec maintien stable et embouts souples.",
    image: "images/appareil-05.jpg"
  },
  {
    name: "AUDIBEL Smart Tone 6",
    category: "Automatique",
    description: "Adapte automatiquement le volume et la directivite selon la scene sonore.",
    image: "images/appareil-06.jpg"
  },
  {
    name: "AUDIBEL Ultra Voice 7",
    category: "Conversation",
    description: "Mise en avant de la voix pour faciliter les echanges en groupe.",
    image: "images/appareil-07.jpg"
  },
  {
    name: "AUDIBEL Soft Mini 8",
    category: "Ultra compact",
    description: "Design leger et discret avec performance equilibree dans les lieux publics.",
    image: "images/appareil-08.jpg"
  },
  {
    name: "AUDIBEL Prime 9",
    category: "Premium",
    description: "Traitement audio avance pour une perception plus riche des details sonores.",
    image: "images/appareil-09.jpg"
  },
  {
    name: "AUDIBEL Elite 10",
    category: "Haut de gamme",
    description: "Experience auditive complete, confort eleve et options de personnalisation etendues.",
    image: "images/appareil-10.jpg"
  }
];

const header = document.querySelector(".site-header");
const scrollProgress = document.querySelector(".scroll-progress");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const navIndicator = document.querySelector(".nav-indicator");
const menuToggle = document.querySelector(".menu-toggle");
const sectionNodes = [...document.querySelectorAll("main section[id]")];
const devicesGrid = document.getElementById("devices-grid");

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

function renderDevices() {
  const fragment = document.createDocumentFragment();

  devices.forEach((device, index) => {
    const card = document.createElement("article");
    card.className = "device-card reveal";
    card.style.setProperty("--delay", `${Math.min(index * 30, 220)}ms`);

    card.innerHTML = `
      <div class="device-image-wrap">
        <img src="${device.image}" alt="${device.name}" loading="lazy">
      </div>
      <div class="device-content">
        <div class="device-topline">
          <h3>${device.name}</h3>
          <span class="device-tag">${device.category}</span>
        </div>
        <p>${device.description}</p>
      </div>
    `;

    const image = card.querySelector("img");
    image.addEventListener("error", () => {
      image.src = placeholderImage(device.name);
    }, { once: true });

    fragment.appendChild(card);
  });

  devicesGrid.appendChild(fragment);
}

function setScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
}

function setHeaderState() {
  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function setActiveLink() {
  let currentId = sectionNodes[0]?.id ?? "accueil";
  const targetY = window.scrollY + window.innerHeight * 0.35;

  sectionNodes.forEach((section) => {
    if (section.offsetTop <= targetY) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
}

function moveIndicator() {
  if (window.innerWidth <= 760) {
    navIndicator.style.width = "0";
    return;
  }

  const activeLink = nav.querySelector(".nav-link.active");
  if (!activeLink) {
    navIndicator.style.width = "0";
    return;
  }

  const navRect = nav.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();
  navIndicator.style.width = `${linkRect.width - 20}px`;
  navIndicator.style.transform = `translateX(${linkRect.left - navRect.left + 10}px)`;
}

let ticking = false;

function onScroll() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    setHeaderState();
    setScrollProgress();
    setActiveLink();
    moveIndicator();
    ticking = false;
  });
}

function closeMenu() {
  nav.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function initMenu() {
  menuToggle.addEventListener("click", () => {
    const willOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", willOpen);
    menuToggle.classList.toggle("open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 760) {
        closeMenu();
      }
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
  renderDevices();
  initMenu();
  initReveal();

  setHeaderState();
  setScrollProgress();
  setActiveLink();
  moveIndicator();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
    moveIndicator();
  });

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", moveIndicator);
    link.addEventListener("focus", moveIndicator);
  });
}

init();
