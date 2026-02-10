const devices = Array.isArray(window.AUDIBEL_DEVICES) ? window.AUDIBEL_DEVICES : [];
const HOME_CAROUSEL_LIMIT = 4;
const carouselDevices = devices.slice(0, HOME_CAROUSEL_LIMIT);

const header = document.querySelector(".site-header");
const scrollProgress = document.querySelector(".scroll-progress");
const nav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const navIndicator = document.querySelector(".nav-indicator");
const menuToggle = document.querySelector(".menu-toggle");
const sectionNodes = [...document.querySelectorAll("main section[id]")];

const carousel = document.getElementById("devices-carousel");
const carouselTrack = document.getElementById("devices-carousel-track");
const carouselPrevButton = document.querySelector('[data-carousel="prev"]');
const carouselNextButton = document.querySelector('[data-carousel="next"]');
const carouselDots = document.getElementById("carousel-dots");

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

function getSlideStep() {
  if (!carouselTrack) {
    return 1;
  }

  const slide = carouselTrack.querySelector(".device-slide");
  if (!slide) {
    return 1;
  }

  const slideWidth = slide.getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(carouselTrack).gap || "0");
  return slideWidth + gap;
}

function getActiveSlideIndex() {
  if (!carousel) {
    return 0;
  }

  const step = getSlideStep();
  const raw = step > 0 ? carousel.scrollLeft / step : 0;
  const max = Math.max(carouselDevices.length - 1, 0);
  return Math.max(0, Math.min(Math.round(raw), max));
}

function setActiveDot(index) {
  if (!carouselDots) {
    return;
  }

  [...carouselDots.querySelectorAll(".carousel-dot")].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
    dot.setAttribute("aria-current", String(dotIndex === index));
  });
}

function goToSlide(index) {
  if (!carousel) {
    return;
  }

  const step = getSlideStep();
  const maxIndex = Math.max(carouselDevices.length - 1, 0);
  const clamped = Math.max(0, Math.min(index, maxIndex));
  carousel.scrollTo({
    left: clamped * step,
    behavior: "smooth"
  });
}

function renderCarouselDots() {
  if (!carouselDots) {
    return;
  }

  carouselDots.innerHTML = "";
  const fragment = document.createDocumentFragment();

  carouselDevices.forEach((device, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Aller a ${device.name}`);
    dot.addEventListener("click", () => goToSlide(index));
    fragment.appendChild(dot);
  });

  carouselDots.appendChild(fragment);
  setActiveDot(0);
}

function renderDevicesCarousel() {
  if (!carouselTrack) {
    return;
  }

  if (!carouselDevices.length) {
    carouselTrack.innerHTML = "<p>Aucun appareil n'est configure pour le moment.</p>";
    if (carouselPrevButton) {
      carouselPrevButton.hidden = true;
    }
    if (carouselNextButton) {
      carouselNextButton.hidden = true;
    }
    return;
  }

  const fragment = document.createDocumentFragment();

  carouselDevices.forEach((device, index) => {
    const link = document.createElement("a");
    link.className = "device-slide";
    link.href = `appareil.html?slug=${encodeURIComponent(device.slug)}`;
    link.setAttribute("aria-label", `Voir la page dediee de ${device.name}`);
    link.style.setProperty("--delay", `${Math.min(index * 28, 220)}ms`);

    link.innerHTML = `
      <article class="device-card reveal">
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

  carouselTrack.appendChild(fragment);
  renderCarouselDots();
}

function initCarousel() {
  if (!carousel) {
    return;
  }

  if (carouselPrevButton) {
    carouselPrevButton.addEventListener("click", () => {
      const index = getActiveSlideIndex();
      goToSlide(index - 1);
    });
  }

  if (carouselNextButton) {
    carouselNextButton.addEventListener("click", () => {
      const index = getActiveSlideIndex();
      goToSlide(index + 1);
    });
  }

  let carouselTicking = false;
  carousel.addEventListener("scroll", () => {
    if (carouselTicking) {
      return;
    }

    carouselTicking = true;
    window.requestAnimationFrame(() => {
      setActiveDot(getActiveSlideIndex());
      carouselTicking = false;
    });
  }, { passive: true });
}

function setScrollProgress() {
  if (!scrollProgress) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
}

function setHeaderState() {
  if (!header) {
    return;
  }

  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function setActiveLink() {
  if (!sectionNodes.length || !navLinks.length) {
    return;
  }

  let currentId = sectionNodes[0].id;
  const targetY = window.scrollY + window.innerHeight * 0.35;

  sectionNodes.forEach((section) => {
    if (section.offsetTop <= targetY) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isAnchorMatch = href === `#${currentId}`;
    const isCatalogPreviewMatch = currentId === "appareils" && href === "appareils.html";
    const isActive = isAnchorMatch || isCatalogPreviewMatch;
    link.classList.toggle("active", isActive);
  });
}

function moveIndicator() {
  if (!navIndicator || !nav) {
    return;
  }

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
  navIndicator.style.width = `${Math.max(linkRect.width - 20, 10)}px`;
  navIndicator.style.transform = `translateX(${linkRect.left - navRect.left + 10}px)`;
}

let pageTicking = false;

function onScroll() {
  if (pageTicking) {
    return;
  }

  pageTicking = true;
  window.requestAnimationFrame(() => {
    setHeaderState();
    setScrollProgress();
    setActiveLink();
    moveIndicator();
    pageTicking = false;
  });
}

function closeMenu() {
  if (!nav || !menuToggle) {
    return;
  }

  nav.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function initMenu() {
  if (!menuToggle || !nav) {
    return;
  }

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
  renderDevicesCarousel();
  initCarousel();
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
    setActiveDot(getActiveSlideIndex());
  });

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", moveIndicator);
    link.addEventListener("focus", moveIndicator);
  });
}

init();
