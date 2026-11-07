document.getElementById("year").textContent = new Date().getFullYear();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile menu
const menuBtn = document.getElementById("menuBtn"), navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", navLinks.classList.toggle("open")));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false");
}));

// Typing line in the hero
const words = ["builds AI projects.", "leads hackathon teams.", "turns real problems into prototypes."];
const typed = document.getElementById("typed");
if (reduce) typed.textContent = words[0];
else {
  let w = 0, i = 0, del = false;
  (function tick() {
    typed.textContent = words[w].slice(0, i);
    if (!del && i === words[w].length) { del = true; return setTimeout(tick, 1600); }
    if (del && i === 0) { del = false; w = (w + 1) % words.length; }
    i += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 70);
  })();
}

// Count-up numbers
function count(el) {
  const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || "";
  if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
  const t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * e).toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

// Reveal on scroll + start counters
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); }
}));
document.querySelectorAll("[data-count]").forEach(el => cio.observe(el));

// Glow that follows the pointer inside project cards
document.querySelectorAll(".project").forEach(card => card.addEventListener("pointermove", e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--x", (e.clientX - r.left) + "px");
  card.style.setProperty("--y", (e.clientY - r.top) + "px");
}));

// Highlight current section in the nav
const links = navLinks.querySelectorAll("a");
const sio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
links.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) sio.observe(s); });
