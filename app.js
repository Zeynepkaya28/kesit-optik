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
