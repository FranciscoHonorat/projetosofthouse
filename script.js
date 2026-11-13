// ============ MENU MOBILE ============
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ============ SOMBRA NO HEADER AO ROLAR ============
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ============ ANIMAÇÃO DE ENTRADA + CONTADORES ============
const revealTargets = document.querySelectorAll(
  ".section__head, .card, .sec-list li, .step, .faq details, .form, .contact__intro"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        const counter = entry.target.querySelector("[data-count]");
        if (counter) animateCount(counter);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = el.dataset.count));
}

// ============ FAQ: abre um por vez ============
const faqItems = document.querySelectorAll(".faq details");
faqItems.forEach((item) =>
  item.addEventListener("toggle", () => {
    if (item.open) faqItems.forEach((other) => other !== item && (other.open = false));
  })
);

// ============ FORMULÁRIO ============
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.className = "form__status";

  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const empty = field.type === "checkbox" ? !field.checked : !field.value.trim();
    const badEmail = field.type === "email" && field.value && !emailRe.test(field.value);
    const invalid = empty || badEmail;
    field.classList.toggle("is-invalid", invalid);
    if (invalid) valid = false;
  });

  if (!valid) {
    statusEl.textContent = "Preencha os campos obrigatórios corretamente.";
    statusEl.classList.add("err");
    return;
  }

  const data = Object.fromEntries(new FormData(form));

  // TODO: integrar com o backend/CRM (ex.: fetch("/api/contato", { method: "POST", body: JSON.stringify(data) }))
  console.info("Lead capturado:", data);

  form.reset();
  statusEl.textContent = "Obrigado! Você receberá um retorno em até 1 dia útil.";
  statusEl.classList.add("ok");
});

form.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));

// ============ BANNER DE COOKIES ============
const cookie = document.getElementById("cookie");
let consent = null;
try { consent = localStorage.getItem("cc-cookie"); } catch (_) {}
if (!consent) cookie.hidden = false;

cookie.querySelectorAll("[data-cookie]").forEach((btn) =>
  btn.addEventListener("click", () => {
    try { localStorage.setItem("cc-cookie", btn.dataset.cookie); } catch (_) {}
    cookie.hidden = true;
  })
);

// ============ ANO NO RODAPÉ ============
document.getElementById("year").textContent = new Date().getFullYear();
