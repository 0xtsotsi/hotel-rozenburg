/* Hotel Rozenburg — concept interactions */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: transparent over hero, solid after scroll ---------- */
  var header = document.querySelector(".header");
  var shell = document.querySelector(".header-shell");
  var topbar = document.querySelector(".topbar");

  function onScroll() {
    if (!header) return;
    var y = window.scrollY;
    var threshold = topbar ? topbar.offsetHeight : 0;
    var solid = y > threshold + 30;

    if (shell) shell.classList.toggle("is-scrolled", solid);
    header.classList.toggle("header--solid", solid);
    header.classList.toggle("header--transparent", !solid);

    var top = document.querySelector(".to-top");
    if (top) top.classList.toggle("is-visible", y > 600);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".mobile-menu");

  function closeMenu() {
    if (!menu || !burger) return;
    menu.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
  }

  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Hero slider ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero__slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero__dots button"));
  var counter = document.querySelector("[data-slide-counter]");
  var heroTimer = null;
  var heroIndex = 0;

  function showSlide(index) {
    if (!slides.length) return;
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle("is-active", i === heroIndex); });
    dots.forEach(function (d, i) {
      d.classList.toggle("is-active", i === heroIndex);
      d.setAttribute("aria-selected", String(i === heroIndex));
    });
    if (counter) counter.textContent = String(heroIndex + 1).padStart(2, "0");
  }

  function startHeroTimer() {
    if (reduceMotion || slides.length < 2) return;
    heroTimer = window.setInterval(function () { showSlide(heroIndex + 1); }, 6500);
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      showSlide(i);
      window.clearInterval(heroTimer);
      startHeroTimer();
    });
  });

  showSlide(0);
  startHeroTimer();

  /* ---------- Generic horizontal sliders ---------- */
  document.querySelectorAll("[data-slider]").forEach(function (wrap) {
    var track = wrap.querySelector(".slider__track");
    var prev = wrap.querySelector("[data-slider-prev]");
    var next = wrap.querySelector("[data-slider-next]");
    if (!track) return;

    function step() {
      var item = track.querySelector(".slider__item");
      var amount = item ? item.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
      return amount;
    }

    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }); });
  });

  /* ---------- Reviews ---------- */
  var reviews = Array.prototype.slice.call(document.querySelectorAll(".review"));
  var reviewDots = Array.prototype.slice.call(document.querySelectorAll("[data-review-dot]"));
  var reviewIndex = 0;

  function showReview(index) {
    if (!reviews.length) return;
    reviewIndex = (index + reviews.length) % reviews.length;
    reviews.forEach(function (r, i) { r.classList.toggle("is-active", i === reviewIndex); });
    reviewDots.forEach(function (d, i) {
      d.classList.toggle("is-active", i === reviewIndex);
      d.setAttribute("aria-selected", String(i === reviewIndex));
    });
  }

  reviewDots.forEach(function (dot, i) {
    dot.addEventListener("click", function () { showReview(i); });
  });

  var reviewPrev = document.querySelector("[data-review-prev]");
  var reviewNext = document.querySelector("[data-review-next]");
  if (reviewPrev) reviewPrev.addEventListener("click", function () { showReview(reviewIndex - 1); });
  if (reviewNext) reviewNext.addEventListener("click", function () { showReview(reviewIndex + 1); });
  showReview(0);

  /* ---------- Accordion ---------- */
  document.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".accordion__item");
      var open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      var group = el.getAttribute("data-reveal");
      if (group) {
        var peers = document.querySelectorAll('[data-reveal="' + group + '"]');
        el.style.setProperty("--reveal-delay", (Array.prototype.indexOf.call(peers, el) * 90) + "ms");
      }
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Counting stats ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var duration = 1400;
        var start = null;

        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- Booking bar (demo) ---------- */
  var bookingForm = document.querySelector("[data-booking-form]");
  if (bookingForm) {
    var today = new Date();
    var arrival = bookingForm.querySelector("[name=arrival]");
    var departure = bookingForm.querySelector("[name=departure]");
    var feedback = document.querySelector("[data-booking-feedback]");

    function iso(date) { return date.toISOString().slice(0, 10); }
    if (arrival) {
      arrival.min = iso(today);
      arrival.value = iso(new Date(today.getTime() + 86400000 * 2));
    }
    if (departure) {
      departure.min = iso(new Date(today.getTime() + 86400000 * 3));
      departure.value = iso(new Date(today.getTime() + 86400000 * 3));
    }
    if (arrival && departure) {
      arrival.addEventListener("change", function () {
        if (departure.value <= arrival.value) {
          var d = new Date(arrival.value);
          d.setDate(d.getDate() + 1);
          departure.value = iso(d);
        }
        departure.min = arrival.value;
      });
    }

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!feedback) return;
      var data = new FormData(bookingForm);
      var a = data.get("arrival");
      var d = data.get("departure");
      var guests = data.get("guests") || "2";
      var nights = 1;
      if (a && d) {
        nights = Math.max(1, Math.round((new Date(d) - new Date(a)) / 86400000));
      }
      var fmt = function (isoDate) {
        if (!isoDate) return "";
        var dt = new Date(isoDate + "T00:00:00");
        return dt.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
      };
      feedback.innerHTML =
        "<strong>Demo — beschikbaarheid.</strong> Voor " + guests + " gast(en) van " + fmt(a) +
        " tot " + fmt(d) + " (" + nights + " nacht(en)) levert de boekingsmotor live de tarieven. " +
        "<a class='link-underline' href='https://ibe.smarthotel.nl/?id=aa4fe399-9d43-4f9a-97b3-ec89d5967ba8&amp;segment=Hotel' target='_blank' rel='noopener'>Open de boekingsmotor</a>";
      feedback.classList.add("is-visible");
    });
  }

  /* ---------- Contact form (demo) ---------- */
  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var out = document.querySelector("[data-contact-feedback]");
      if (!out) return;
      var name = contactForm.querySelector("[name=name]");
      out.innerHTML = "<strong>Bedankt" + (name && name.value ? ", " + name.value : "") + ".</strong> Dit is een demo: in de live versie wordt uw bericht naar info@hotel-rozenburg.nl verstuurd.";
      out.classList.add("is-visible");
      contactForm.reset();
    });
  }

  /* ---------- Back to top ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
