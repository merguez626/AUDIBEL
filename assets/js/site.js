/* AUDIOBEL — scripts v2 (refonte) */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Taille du texte ---------- */
  var sizeBtns = document.querySelectorAll("[data-text-size]");
  function applySize(size) {
    if (size === "lg") document.documentElement.setAttribute("data-text", "lg");
    else document.documentElement.removeAttribute("data-text");
    sizeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.textSize === size)); });
  }
  applySize(store.get("ab-text") === "lg" ? "lg" : "md");
  sizeBtns.forEach(function (b) {
    b.addEventListener("click", function () { applySize(b.dataset.textSize); store.set("ab-text", b.dataset.textSize); });
  });

  /* ---------- Header : ombre au scroll + menu mobile ---------- */
  var header = document.querySelector(".header");
  var onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    if (open && header) nav.style.top = Math.max(0, header.getBoundingClientRect().bottom) + "px";
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  /* ---------- Horaires : statut ouvert/fermé (heure de Bruxelles) ---------- */
  // 0 = dimanche … 6 = samedi ; [ouverture, fermeture] en heures décimales
  var HOURS = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 13] };
  var DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  function brusselsNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Brussels", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
      var map = {}; parts.forEach(function (p) { map[p.type] = p.value; });
      var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(map.weekday);
      return { day: wd, h: (parseInt(map.hour, 10) % 24) + parseInt(map.minute, 10) / 60 };
    } catch (e) { var d = new Date(); return { day: d.getDay(), h: d.getHours() + d.getMinutes() / 60 }; }
  }
  function fmt(h) { var m = Math.round((h % 1) * 60); return Math.floor(h) + "h" + (m ? String(m).padStart(2, "0") : ""); }
  var now = brusselsNow();
  document.querySelectorAll("[data-open-status]").forEach(function (el) {
    var today = HOURS[now.day];
    var open = !!today && now.h >= today[0] && now.h < today[1];
    el.setAttribute("data-open", String(open));
    if (open) { el.textContent = "Ouvert jusqu'à " + fmt(today[1]); return; }
    for (var i = 0; i < 8; i++) {
      var d = (now.day + i) % 7, slot = HOURS[d];
      if (!slot) continue;
      if (i === 0 && now.h < slot[0]) { el.textContent = "Fermé · ouvre à " + fmt(slot[0]); return; }
      if (i > 0) { el.textContent = "Fermé · ouvre " + (i === 1 ? "demain" : DAYS[d]) + " à " + fmt(slot[0]); return; }
    }
  });
  document.querySelectorAll(".hours tr[data-day]").forEach(function (tr) {
    if (tr.dataset.day.split(",").indexOf(String(now.day)) !== -1) tr.classList.add("today");
  });

  /* ---------- Auto-évaluation « 6 signes » ---------- */
  var check = document.querySelector("[data-check]");
  if (check) {
    var signs = check.querySelectorAll(".sign");
    var countEl = check.querySelector("[data-check-count]");
    var titleEl = check.querySelector("[data-check-title]");
    var textEl = check.querySelector("[data-check-text]");
    var bars = check.querySelectorAll(".check-meter i");
    var MSG = {
      none: ["Cochez ce qui vous ressemble", "Sélectionnez les situations que vous vivez régulièrement. Le résultat s'affiche ici, instantanément."],
      one: ["Un signal isolé n'est pas alarmant", "Restez attentif. Si la gêne s'installe ou si d'autres signes apparaissent, un bilan permet d'y voir clair en 45 minutes."],
      tinnitus: ["Des acouphènes méritent une analyse", "Sifflements ou bourdonnements persistants : un bilan mesure leur fréquence et leur intensité pour orienter la prise en charge."],
      many: ["Plusieurs signes cumulés méritent un bilan", "Plus le diagnostic est précoce, plus l'adaptation est confortable. Un bilan clinique de 45 minutes vous donnera une réponse précise."]
    };
    function update() {
      var on = check.querySelectorAll('.sign[aria-pressed="true"]');
      var n = on.length;
      var tinnitus = check.querySelector('.sign[data-sign="acouphenes"][aria-pressed="true"]');
      var key = n === 0 ? "none" : n >= 2 ? "many" : tinnitus ? "tinnitus" : "one";
      countEl.textContent = n;
      titleEl.textContent = MSG[key][0];
      textEl.textContent = MSG[key][1];
      bars.forEach(function (b, i) { b.classList.toggle("on", i < n); });
    }
    signs.forEach(function (s) {
      s.addEventListener("click", function () {
        s.setAttribute("aria-pressed", String(s.getAttribute("aria-pressed") !== "true"));
        update();
      });
    });
    update();
  }

  /* ---------- Formulaire de rendez-vous ---------- */
  var form = document.querySelector("[data-booking]");
  if (form) {
    // Pré-sélection via l'ancre : #proche, #suivi, #bilan, #acouphenes
    var hash = (location.hash || "").replace("#", "");
    var pre = { proche: ["pour", "proche"], suivi: ["motif", "suivi"], bilan: ["motif", "bilan"], acouphenes: ["motif", "acouphenes"], essai: ["motif", "essai"], question: ["motif", "question"] }[hash];
    if (pre) {
      var input = form.querySelector('input[name="' + pre[0] + '"][value="' + pre[1] + '"]');
      if (input) input.checked = true;
    }
    var procheFields = form.querySelector("[data-proche-fields]");
    function syncProche() {
      var isProche = form.querySelector('input[name="pour"][value="proche"]').checked;
      procheFields.classList.toggle("hidden", !isProche);
    }
    form.querySelectorAll('input[name="pour"]').forEach(function (r) { r.addEventListener("change", syncProche); });
    syncProche();

    // En local (serveur statique), on simule l'envoi : Netlify Forms ne fonctionne qu'une fois déployé.
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
      form.addEventListener("submit", function (e) {
        if (!form.checkValidity()) return;
        e.preventDefault();
        location.href = form.getAttribute("action");
      });
    }
  }

  /* ---------- Simulateur d'intervention INAMI ---------- */
  // Montants indicatifs INAMI 2026 (à mettre à jour lors de chaque indexation)
  var INAMI = { enfant: [1451.56, 2875.21], adulte: [884.59, 1751.01], senior: [859.59, 1701.46] };
  var sim = document.querySelector("[data-sim]");
  if (sim) {
    var out = sim.querySelector("output");
    var detail = sim.querySelector("[data-sim-detail]");
    var LABELS = { enfant: "moins de 18 ans", adulte: "18 à 64 ans", senior: "65 ans et plus" };
    var euro = new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
    var calc = function () {
      var age = sim.querySelector('input[name="sim-age"]:checked').value;
      var ears = sim.querySelector('input[name="sim-oreilles"]:checked').value === "2" ? 1 : 0;
      out.textContent = "≈ " + euro.format(Math.floor(INAMI[age][ears])); // arrondi inférieur, comme le tableau
      detail.textContent = "Intervention INAMI indicative 2026, " + LABELS[age] + ", " + (ears ? "deux oreilles" : "une oreille") +
        ". Votre mutualité peut ajouter une intervention complémentaire.";
    };
    sim.addEventListener("change", calc);
    calc();
  }

  /* ---------- Carte Google Maps chargée seulement sur demande ---------- */
  document.querySelectorAll("[data-map-load]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.closest(".map-box");
      var iframe = document.createElement("iframe");
      iframe.src = box.dataset.mapSrc;
      iframe.title = "Carte : AUDIOBEL, rue du Sart-Tilman 384, 4031 Liège";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.allowFullscreen = true;
      box.appendChild(iframe);
      box.querySelector(".map-consent").remove();
    });
  });

  /* ---------- Apparition au scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Année ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
