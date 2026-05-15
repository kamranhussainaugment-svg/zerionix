// Body fade-in on load
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// Scroll fade-in (IntersectionObserver)
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.style.transitionDelay = el.dataset.delay || "0s";
    el.classList.add("visible");
    fadeObserver.unobserve(el);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));

// Sticky header + back-to-top visibility
const header = document.querySelector("[data-site-header]");
const backToTop = document.querySelector("[data-back-to-top]");
const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 60);
  backToTop?.classList.toggle("visible", y > 400);
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Active nav link
const page = document.body.dataset.page;
document.querySelectorAll("[data-nav-link]").forEach(link => {
  const href = link.getAttribute("href");
  if ((page === "home" && href === "index.html") ||
      (page !== "home" && href === `${page}.html`)) {
    link.classList.add("active");
  }
});

// Mobile menu
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileClose = document.querySelector("[data-mobile-close]");
const closeMenu = () => {
  mobileMenu?.classList.remove("open");
  document.body.style.overflow = "";
};
navToggle?.addEventListener("click", () => {
  mobileMenu?.classList.add("open");
  document.body.style.overflow = "hidden";
});
mobileClose?.addEventListener("click", closeMenu);
mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Back to top
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Count-up animation for stat numbers
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1500;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach(el => countObserver.observe(el));

// Custom cursor (desktop only)
const cursor = document.querySelector("[data-cursor]");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener("mousemove", e => {
    tx = e.clientX; ty = e.clientY;
    cursor.classList.add("active");
  });
  const lerp = (a, b, t) => a + (b - a) * t;
  const moveCursor = () => {
    cx = lerp(cx, tx, 0.14); cy = lerp(cy, ty, 0.14);
    cursor.style.left = cx + "px"; cursor.style.top = cy + "px";
    requestAnimationFrame(moveCursor);
  };
  moveCursor();
  document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
}

// Contact form validation
const form = document.querySelector("[data-contact-form]");
if (form) {
  const setError = (field, msg) => {
    if (!field) return;
    field.style.borderColor = "var(--color-error)";
    const g = field.closest(".field-group");
    if (!g) return;
    let err = g.querySelector(".field-error");
    if (!err) { err = document.createElement("div"); err.className = "field-error"; g.appendChild(err); }
    err.textContent = msg;
  };
  const clearErrors = () => {
    form.querySelectorAll(".field-error").forEach(e => e.remove());
    form.querySelectorAll("input, select, textarea").forEach(f => { f.style.borderColor = ""; });
  };
  form.addEventListener("submit", e => {
    e.preventDefault(); clearErrors();
    const n = form.querySelector('[name="fullName"]');
    const em = form.querySelector('[name="email"]');
    const t = form.querySelector('[name="projectType"]');
    const m = form.querySelector('[name="message"]');
    let hasError = false;
    if (!n?.value.trim()) { setError(n, "Full name is required."); hasError = true; }
    if (!em?.value.trim()) { setError(em, "Email is required."); hasError = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { setError(em, "Enter a valid email address."); hasError = true; }
    if (!t?.value) { setError(t, "Select a project type."); hasError = true; }
    if (!m?.value.trim()) { setError(m, "Tell us about your project."); hasError = true; }
    if (hasError) return;
    form.innerHTML = `<div class="form-success"><div class="form-success-icon">✓</div><h3 style="color:var(--color-text-primary);margin-bottom:12px;">Message sent</h3><p>We will be in touch within 24 hours.</p></div>`;
  });
}
