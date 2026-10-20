// Year in footer
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Light / dark toggle
(function () {
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  var root = document.documentElement;
  function sync() {
    var light = root.getAttribute("data-theme") === "light";
    btn.textContent = light ? "🌙" : "☀️";
    btn.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    window.dispatchEvent(new Event("themechange"));
  }
  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
  });
  sync();
})();

// Typing effect
(function () {
  var phrases = [
    "Python Wizard · Systems & ML",
    "Breaking the black box with GlassBoxML",
    "Chasing database internals for fun",
    "Compilers · Astronomy · Deep Learning",
  ];
  var el = document.getElementById("typed");
  if (!el) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { el.textContent = phrases[0]; return; }
  var p = 0, i = 0, deleting = false;
  function tick() {
    var full = phrases[p];
    el.textContent = full.slice(0, i);
    var delay = deleting ? 28 : 55;
    if (!deleting && i === full.length) { deleting = true; delay = 1600; }
    else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 350; }
    i += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  tick();
})();

// Reveal on scroll
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (n) { n.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(function (n) { io.observe(n); });
})();

// Starfield with gentle drift and twinkle
(function () {
  var canvas = document.getElementById("stars");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [], w, h, dpr, color = "#cfe3ff";

  function readColor() {
    var c = getComputedStyle(document.documentElement).getPropertyValue("--star").trim();
    if (c) color = c;
  }
  window.addEventListener("themechange", function () { readColor(); if (reduce) draw(0); });
  readColor();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round((w * h) / 9000);
    stars = [];
    for (var k = 0; k < count; k++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        s: Math.random() * 0.12 + 0.02,
        t: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    for (var k = 0; k < stars.length; k++) {
      var st = stars[k];
      var a = 0.45 + 0.45 * Math.sin(time / 900 + st.t);
      ctx.globalAlpha = reduce ? 0.7 : a;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
      if (!reduce) {
        st.y += st.s;
        if (st.y > h + 2) { st.y = -2; st.x = Math.random() * w; }
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", function () { resize(); if (reduce) draw(0); });
  resize();
  requestAnimationFrame(draw);
})();
