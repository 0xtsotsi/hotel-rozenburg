/**
 * Hotel Rozenburg — concept interactions.
 * ESM, no global state, no implicit globals.
 */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js");

/* ------------------------------------------------------------------ */
/* Header: transparent over the hero, solid once scrolled past it.    */
/* ------------------------------------------------------------------ */
const header = document.querySelector(".header");
const headerShell = document.querySelector(".header-shell");
const topbar = document.querySelector(".topbar");
const toTop = document.querySelector(".to-top");

function onScroll() {
  if (!header) return;
  const threshold = topbar ? topbar.offsetHeight : 0;
  const solid = window.scrollY > threshold + 30;

  headerShell?.classList.toggle("is-scrolled", solid);
  header.classList.toggle("header--solid", solid);
  header.classList.toggle("header--transparent", !solid);
  toTop?.classList.toggle("is-visible", window.scrollY > 600);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ------------------------------------------------------------------ */
/* Mobile menu                                                          */
/* ------------------------------------------------------------------ */
const burger = document.querySelector(".burger");
const menu = document.querySelector(".mobile-menu");

function setMenu(open) {
  if (!menu || !burger) return;
  menu.classList.toggle("is-open", open);
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("is-locked", open);
}

burger?.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu?.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

/* ------------------------------------------------------------------ */
/* Hero slider                                                          */
/* ------------------------------------------------------------------ */
const heroSlides = Array.from(document.querySelectorAll(".hero__slide"));
const heroDots = Array.from(document.querySelectorAll(".hero__dots button"));
const slideCounter = document.querySelector("[data-slide-counter]");
let heroIndex = 0;
let heroTimer = null;

function showSlide(index) {
  if (heroSlides.length === 0) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === heroIndex));
  heroDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === heroIndex);
    dot.setAttribute("aria-selected", String(i === heroIndex));
  });
  if (slideCounter) slideCounter.textContent = String(heroIndex + 1).padStart(2, "0");
}

function startHeroTimer() {
  if (prefersReducedMotion || heroSlides.length < 2) return;
  heroTimer = window.setInterval(() => showSlide(heroIndex + 1), 6500);
}

function restartHeroTimer() {
  window.clearInterval(heroTimer);
  startHeroTimer();
}

heroDots.forEach((dot, i) => dot.addEventListener("click", () => {
  showSlide(i);
  restartHeroTimer();
}));

showSlide(0);
startHeroTimer();

/* ------------------------------------------------------------------ */
/* Horizontal sliders                                                   */
/* ------------------------------------------------------------------ */
document.querySelectorAll("[data-slider]").forEach((wrap) => {
  const track = wrap.querySelector(".slider__track");
  const prev = wrap.querySelector("[data-slider-prev]");
  const next = wrap.querySelector("[data-slider-next]");
  if (!track) return;

  const step = () => {
    const item = track.querySelector(".slider__item");
    return item ? item.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
  };
  const scrollBy = (direction) => {
    track.scrollBy({ left: direction * step(), behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  prev?.addEventListener("click", () => scrollBy(-1));
  next?.addEventListener("click", () => scrollBy(1));
});

/* ------------------------------------------------------------------ */
/* Reviews                                                              */
/* ------------------------------------------------------------------ */
const reviews = Array.from(document.querySelectorAll(".review"));
const reviewDots = Array.from(document.querySelectorAll("[data-review-dot]"));
let reviewIndex = 0;

function showReview(index) {
  if (reviews.length === 0) return;
  reviewIndex = (index + reviews.length) % reviews.length;

  reviews.forEach((review, i) => review.classList.toggle("is-active", i === reviewIndex));
  reviewDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === reviewIndex);
    dot.setAttribute("aria-selected", String(i === reviewIndex));
  });
}

reviewDots.forEach((dot, i) => dot.addEventListener("click", () => showReview(i)));
document.querySelector("[data-review-prev]")?.addEventListener("click", () => showReview(reviewIndex - 1));
document.querySelector("[data-review-next]")?.addEventListener("click", () => showReview(reviewIndex + 1));
showReview(0);

/* ------------------------------------------------------------------ */
/* Accordion                                                            */
/* ------------------------------------------------------------------ */
document.querySelectorAll(".accordion__trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion__item");
    const open = item?.classList.toggle("is-open") ?? false;
    trigger.setAttribute("aria-expanded", String(open));
  });
});

/* ------------------------------------------------------------------ */
/* Scroll reveal                                                        */
/* ------------------------------------------------------------------ */
const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));

function revealAll() {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });

  revealTargets.forEach((el) => {
    const group = el.getAttribute("data-reveal");
    if (group) {
      const peers = Array.from(document.querySelectorAll(`[data-reveal="${group}"]`));
      el.style.setProperty("--reveal-delay", `${peers.indexOf(el) * 90}ms`);
    }
    observer.observe(el);
  });

  // Safety net: never leave content permanently invisible if the observer
  // misfires. Only elements already scrolled past are forced visible, so
  // below-the-fold content keeps its reveal animation.
  window.setTimeout(() => {
    const viewportBottom = window.scrollY + window.innerHeight;
    revealTargets.forEach((el) => {
      if (el.getBoundingClientRect().top + window.scrollY < viewportBottom) {
        el.classList.add("is-visible");
      }
    });
  }, 4000);
}

/* ------------------------------------------------------------------ */
/* Counting stats                                                       */
/* ------------------------------------------------------------------ */
const counters = Array.from(document.querySelectorAll("[data-count]"));

if (counters.length > 0 && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number.parseFloat(el.getAttribute("data-count") ?? "0");
      const suffix = el.getAttribute("data-suffix") ?? "";
      const duration = 1400;
      let start = null;

      const step = (timestamp) => {
        if (start === null) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        el.textContent = String(Math.round(target * eased)) + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

/* ------------------------------------------------------------------ */
/* Booking bar (demo)                                                   */
/* ------------------------------------------------------------------ */
const bookingForm = document.querySelector("[data-booking-form]");

if (bookingForm) {
  const arrival = bookingForm.querySelector("[name=arrival]");
  const departure = bookingForm.querySelector("[name=departure]");
  const feedback = document.querySelector("[data-booking-feedback]");

  const toIso = (date) => date.toISOString().slice(0, 10);
  const today = new Date();

  if (arrival) {
    arrival.min = toIso(today);
    arrival.value = toIso(new Date(today.getTime() + 86400000 * 2));
  }
  if (departure) {
    departure.min = toIso(new Date(today.getTime() + 86400000 * 3));
    departure.value = toIso(new Date(today.getTime() + 86400000 * 3));
  }
  arrival?.addEventListener("change", () => {
    if (!arrival.value || !departure) return;
    if (departure.value <= arrival.value) {
      const next = new Date(`${arrival.value}T00:00:00`);
      next.setDate(next.getDate() + 1);
      departure.value = toIso(next);
    }
    departure.min = arrival.value;
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!feedback) return;

    const data = new FormData(bookingForm);
    const arrivalDate = data.get("arrival");
    const departureDate = data.get("departure");
    const guests = data.get("guests") || "2";
    const nights = arrivalDate && departureDate
      ? Math.max(1, Math.round((new Date(departureDate) - new Date(arrivalDate)) / 86400000))
      : 1;

    const format = (value) => (value
      ? new Date(`${value}T00:00:00`).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })
      : "");

    feedback.innerHTML =
      `<strong>Demo — beschikbaarheid.</strong> Voor ${guests} gast(en) van ${format(arrivalDate)} ` +
      `tot ${format(departureDate)} (${nights} nacht(en)) levert de boekingsmotor live de tarieven. ` +
      `<a class="link-underline" href="https://ibe.smarthotel.nl/?id=aa4fe399-9d43-4f9a-97b3-ec89d5967ba8&amp;segment=Hotel" ` +
      `target="_blank" rel="noopener">Open de boekingsmotor</a>`;
    feedback.classList.add("is-visible");
  });
}

/* ------------------------------------------------------------------ */
/* Contact form (demo)                                                  */
/* ------------------------------------------------------------------ */
const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const output = document.querySelector("[data-contact-feedback]");
    if (!output) return;

    const nameField = contactForm.querySelector("[name=name]");
    const name = nameField instanceof HTMLInputElement ? nameField.value.trim() : "";
    output.innerHTML =
      `<strong>Bedankt${name ? `, ${name}` : ""}.</strong> Dit is een demo: in de live versie ` +
      `wordt uw bericht naar info@hotel-rozenburg.nl verstuurd.`;
    output.classList.add("is-visible");
    contactForm.reset();
  });
}

/* ------------------------------------------------------------------ */
/* Misc                                                                 */
/* ------------------------------------------------------------------ */
toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
