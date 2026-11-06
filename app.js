"use strict";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;

/* ---------- Tema ---------- */
const darkQuery = matchMedia("(prefers-color-scheme: dark)");

function activeTheme() {
  return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
}
function syncTheme() {
  const t = activeTheme();
  root.dataset.themeActive = t;
  const btn = $("#theme-toggle");
  if (btn) btn.setAttribute("aria-label", t === "dark" ? "Açık temaya geç" : "Koyu temaya geç");
}
$("#theme-toggle")?.addEventListener("click", () => {
  const next = activeTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("kesit-theme", next); } catch (e) {}
  syncTheme();
});
darkQuery.addEventListener("change", syncTheme);
syncTheme();

/* ---------- Mobil menü ---------- */
$("#menu-btn")?.addEventListener("click", (e) => {
  const nav = $("#nav");
  const open = nav.classList.toggle("is-open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});
$$("#nav-links a").forEach((a) =>
  a.addEventListener("click", () => {
    $("#nav").classList.remove("is-open");
    $("#menu-btn")?.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Bildirim ---------- */
let toastTimer;
function toast(html) {
  const el = $("#toast");
  el.innerHTML = html;
  el.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-on"), 3200);
}

/* ---------- Sepet ---------- */
let cart = 0;
function addToCart(name, price) {
  cart += 1;
  $("#cart-count").textContent = cart;
  toast(`<span>${name} sepete eklendi.</span><span class="mono">${price}</span>`);
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-add]");
  if (b) addToCart(b.dataset.add, b.dataset.price);
});

/* ---------- Gözlük çizimi (kartlar için) ---------- */
// Sol cam şekilleri; sağ cam aynalanır. viewBox 0 0 300 124.
const LENS = {
  round:  '<circle cx="88" cy="64" r="47"/>',
  square: '<rect x="33" y="24" width="108" height="80" rx="12"/>',
  panto:  '<path d="M38 36C60 24 120 23 138 33C144 52 143 88 128 102C112 114 66 115 50 102C34 90 31 52 38 36Z"/>',
  cateye: '<path d="M30 28C62 26 122 30 141 42C143 72 131 100 101 106C71 110 45 100 39 74C36 60 30 44 30 28Z"/>',
  aviator:'<path d="M36 30H137C143 30 145 36 143 46C139 82 125 108 97 108C65 108 41 86 35 52C33 40 30 30 36 30Z"/>',
  hex:    '<path d="M58 22H122L143 64L122 106H58L37 64Z"/>',
  wayfarer:'<path d="M28 28H143L137 90C135 102 127 106 115 106H58C46 106 40 100 38 90Z"/>',
};

function glassesSVG(m) {
  const sw = m.metal ? 4 : 9;
  const lens = LENS[m.shape];
  const fill = m.sun ? `fill="${m.frame}" fill-opacity=".55"` : 'fill="#FFFFFF" fill-opacity=".35"';
  const bridge = m.shape === "aviator"
    ? '<path d="M141 50C146 42 154 42 159 50M137 32H163"/>'
    : m.metal
      ? '<path d="M141 48C146 39 154 39 159 48"/>'
      : '<path d="M141 46C145 37 155 37 159 46"/>';
  const pads = m.metal
    ? '<g stroke-width="1.5"><path d="M141 56c4 6 5 14 4 22M159 56c-4 6-5 14-4 22"/><ellipse cx="143" cy="84" rx="3" ry="7"/><ellipse cx="157" cy="84" rx="3" ry="7"/></g>'
    : "";
  return `<svg viewBox="0 0 300 124" aria-hidden="true" focusable="false">
    <g stroke="${m.frame}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">
      <g ${fill}>${lens}<g transform="matrix(-1 0 0 1 300 0)">${lens}</g></g>
      <g fill="none">${bridge}${pads}<path d="M30 40H10M270 40H290"/></g>
    </g>
  </svg>`;
}

/* ---------- Modeller ---------- */
const MODELS = [
  { no: "01", name: "Moda",      size: "47□22 145", g: 19, price: "1.950 ₺", desc: "Yuvarlak asetat, koyu kaplumbağa. İnce yüzler için.",  shape: "round",    frame: "#8A5A3C", tone: "royal" },
  { no: "02", name: "Cihangir",  size: "52□18 145", g: 27, price: "2.250 ₺", desc: "Köşeli, kalın kaşlı asetat. 6 mm ön kalınlık.",        shape: "square",   frame: "#3A3A3F", tone: "ocean" },
  { no: "03", name: "Kuzguncuk", size: "49□21 145", g: 22, price: "2.450 ₺", desc: "0,8 mm titanyum tel, vidasız yaylı menteşe.",          shape: "panto",    frame: "#9AA0A8", tone: "sapphire", metal: true },
  { no: "04", name: "Bebek",     size: "51□17 140", g: 21, price: "2.150 ₺", desc: "Hafif kalkık kedi gözü, açık bal rengi asetat.",       shape: "cateye",   frame: "#C8873A", tone: "royal" },
  { no: "05", name: "Galata",    size: "55□16 145", g: 24, price: "2.800 ₺", desc: "Çift köprülü havacı, mat altın paslanmaz çelik.",      shape: "aviator",  frame: "#B8975A", tone: "ocean", metal: true },
  { no: "06", name: "Fener",     size: "48□21 145", g: 17, price: "2.650 ₺", desc: "Altıgen titanyum, mat gümüş. Koleksiyonun en hafifi.", shape: "hex",      frame: "#9AA0A8", tone: "true", metal: true },
  { no: "07", name: "Balat",     size: "54□19 145", g: 29, price: "2.350 ₺", desc: "Düz üstlü güneş çerçevesi, UV400 gri cam.",            shape: "wayfarer", frame: "#3A3A3F", tone: "true", sun: true },
];

function cardHTML(m) {
  return `<article class="card" style="--tone: var(--blue-${m.tone})" aria-label="No. ${m.no} ${m.name}">
    <div class="card-meta"><b>No. ${m.no}</b><span>${m.size}</span></div>
    <div class="card-visual">${glassesSVG(m)}</div>
    <div class="card-body">
      <h3 class="card-name">${m.name}</h3>
      <p class="card-desc">${m.desc}</p>
      <div class="card-row">
        <span class="card-price">${m.price}<span class="visually-hidden">, ${m.g} gram</span></span>
        <button class="btn btn--text" type="button" data-inspect="${m.no}">İncele →</button>
      </div>
    </div>
    <div class="card-stripe"></div>
  </article>`;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-inspect]");
  if (!b) return;
  const m = MODELS.find((x) => x.no === b.dataset.inspect);
  toast(`<span>No. ${m.no} ${m.name} · ${m.g} g</span><span class="mono">${m.size}</span>`);
});

/* ---------- 3D döngü ---------- */
(function carousel() {
  const wrap = $("#carousel");
  const ring = $("#ring");
  const stage = $("#stage");
  if (!ring) return;

  const N = MODELS.length;
  const STEP = 360 / N;
  ring.innerHTML = MODELS.map(cardHTML).join("");
  const cards = $$(".card", ring);
  $("#count-total").textContent = String(N).padStart(2, "0");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let pos = 2;          // sürekli konum (sınırsız); tam sayı = öndeki kart
  let radius = 0;
  let flat = reduce.matches;
  const mod = (n) => ((n % N) + N) % N;
  const current = () => mod(Math.round(pos));

  function measure() {
    const w = cards[0].offsetWidth || 360;
    radius = Math.round((w / 2 + 28) / Math.tan(Math.PI / N));
    wrap.style.setProperty("--orbit-w", `${Math.min(radius * 2 + 40, window.innerWidth * 1.2)}px`);
  }

  function render() {
    const cur = current();
    if (!flat) {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${-pos * STEP}deg)`;
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`;
        // öne göre açı farkı → opaklık
        const d = ((i - pos) * STEP * Math.PI) / 180;
        const k = (Math.cos(d) + 1) / 2;
        c.style.opacity = (0.12 + 0.88 * Math.pow(k, 2.2)).toFixed(3);
      });
    }
    cards.forEach((c, i) => {
      const front = flat || i === cur;
      c.toggleAttribute("aria-hidden", !front);
      $$("button, a", c).forEach((el) => (el.tabIndex = front ? 0 : -1));
    });
    $("#count-cur").textContent = String(cur + 1).padStart(2, "0");
    $("#carousel-live").textContent = `${MODELS[cur].name}, ${cur + 1} / ${N}`;
  }

  function go(delta) {
    if (flat) {
      const w = cards[0].offsetWidth + 24;
      const target = mod(Math.round(ring.scrollLeft / w) + delta);
      ring.scrollTo({ left: target * w, behavior: "auto" });
      return;
    }
    pos = Math.round(pos) + delta;
    render();
  }
  function goTo(i) {
    let d = mod(i - current());
    if (d > N / 2) d -= N; // en kısa yoldan dön
    go(d);
  }

  $("#prev").addEventListener("click", () => { go(-1); restart(); });
  $("#next").addEventListener("click", () => { go(1); restart(); });
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  });

  /* Sürükleme / dokunma */
  let dragging = false, startX = 0, startPos = 0, moved = false, pid = null;

  // Arkadaki karta tıklayınca öne getir
  ring.addEventListener("click", (e) => {
    const c = e.target.closest(".card");
    if (!c || flat) return;
    if (moved) { e.preventDefault(); e.stopPropagation(); return; }
    const i = cards.indexOf(c);
    if (i !== current()) { e.preventDefault(); e.stopPropagation(); goTo(i); }
  }, true);

  stage.addEventListener("pointerdown", (e) => {
    if (flat || e.button > 0) return;
    dragging = true; moved = false; pid = e.pointerId;
    startX = e.clientX; startPos = pos;
  });
  stage.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      stage.setPointerCapture(pid);
      stage.classList.add("is-dragging");
      ring.classList.add("no-anim");
      restart();
    }
    if (moved) {
      pos = startPos - dx / (cards[0].offsetWidth * 0.9);
      render();
    }
  });
  const end = (e) => {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    stage.classList.remove("is-dragging");
    ring.classList.remove("no-anim");
    if (moved) { pos = Math.round(pos); render(); restart(); }
    setTimeout(() => (moved = false), 0);
  };
  stage.addEventListener("pointerup", end);
  stage.addEventListener("pointercancel", end);

  // Düz modda sayaç
  ring.addEventListener("scroll", () => {
    if (!flat) return;
    const i = mod(Math.round(ring.scrollLeft / (cards[0].offsetWidth + 24)));
    $("#count-cur").textContent = String(i + 1).padStart(2, "0");
  }, { passive: true });

  /* Otomatik dönüş: 6 sn; üstündeyken, odaktayken, sürüklerken ya da azaltılmış harekette durur */
  let timer = null, hover = false, focus = false;
  const section = $("#modeller");
  section.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hover = true; restart(); } });
  section.addEventListener("pointerleave", () => { hover = false; restart(); });
  section.addEventListener("focusin", () => { focus = true; restart(); });
  section.addEventListener("focusout", (e) => { if (!section.contains(e.relatedTarget)) { focus = false; restart(); } });
  document.addEventListener("visibilitychange", restart);
  function restart() {
    clearInterval(timer);
    timer = null;
    if (flat || hover || focus || dragging || document.hidden) return;
    timer = setInterval(() => go(1), 6000);
  }

  function setMode() {
    flat = reduce.matches;
    wrap.classList.toggle("is-flat", flat);
    ring.classList.add("no-anim");
    if (flat) { ring.style.transform = ""; cards.forEach((c) => { c.style.transform = ""; c.style.opacity = ""; }); }
    measure(); render();
    if (flat) ring.scrollLeft = current() * (cards[0].offsetWidth + 24);
    requestAnimationFrame(() => requestAnimationFrame(() => ring.classList.remove("no-anim")));
    restart();
  }
  reduce.addEventListener("change", setMode);
  let rz;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      ring.classList.add("no-anim"); measure(); render();
      requestAnimationFrame(() => ring.classList.remove("no-anim"));
    }, 120);
  });
  setMode();
})();
