/* ==========================================================================
   Dr. Asna Zehra Naqvi — site interactions (vanilla JS)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav / hamburger ---------- */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main-nav");

  if (hamburger && nav) {
    const backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);

    const toggleNav = (open) => {
      nav.classList.toggle("open", open);
      backdrop.classList.toggle("show", open);
      hamburger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    hamburger.addEventListener("click", () => toggleNav(!nav.classList.contains("open")));
    backdrop.addEventListener("click", () => toggleNav(false));

    /* Dropdown toggle on mobile (tap to expand) */
    nav.querySelectorAll(".has-dropdown > a").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (window.innerWidth <= 820) {
          e.preventDefault();
          link.parentElement.classList.toggle("open");
        }
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const panel = btn.nextElementSibling;
      btn.setAttribute("aria-expanded", String(!expanded));
      panel.style.maxHeight = expanded ? null : panel.scrollHeight + "px";
    });
  });

  /* ---------- Hero tagline rotator ---------- */
  const rotator = document.querySelector(".hero-rotator");
  if (rotator) {
    const taglines = Array.from(rotator.querySelectorAll(".hero-tagline"));
    if (taglines.length > 1) {
      let ti = 0;
      setInterval(() => {
        taglines[ti].classList.remove("is-active");
        ti = (ti + 1) % taglines.length;
        taglines[ti].classList.add("is-active");
      }, 4500);
    }
  }

  /* ---------- Video slider arrows (horizontal scroll) ---------- */
  const reelsTrack = document.getElementById("reels-track");
  if (reelsTrack) {
    const prevBtn = document.querySelector(".reels-prev");
    const nextBtn = document.querySelector(".reels-next");
    const stepBy = () => {
      const card = reelsTrack.querySelector(".reel-card");
      const cardW = card ? card.getBoundingClientRect().width + 20 : 255;
      return Math.max(cardW, reelsTrack.clientWidth * 0.85);
    };
    if (prevBtn) prevBtn.addEventListener("click", () => reelsTrack.scrollBy({ left: -stepBy(), behavior: "smooth" }));
    if (nextBtn) nextBtn.addEventListener("click", () => reelsTrack.scrollBy({ left: stepBy(), behavior: "smooth" }));

    /* ---- Fullscreen Instagram-style viewer ---- */
    const cards = Array.from(reelsTrack.querySelectorAll(".reel-card"));
    const viewer = document.createElement("div");
    viewer.className = "reels-viewer";
    viewer.innerHTML =
      '<button class="rv-close" aria-label="Close videos">&times;</button>' +
      '<button class="rv-nav rv-up" aria-label="Previous video"><i class="fa-solid fa-chevron-up"></i></button>' +
      '<div class="rv-feed"></div>' +
      '<button class="rv-nav rv-down" aria-label="Next video"><i class="fa-solid fa-chevron-down"></i></button>';
    document.body.appendChild(viewer);
    const feed = viewer.querySelector(".rv-feed");
    let items = [];

    const sources = () => cards
      .filter((c) => {
        if (!c.dataset.src || c.classList.contains("is-empty")) return false;
        const v = c.querySelector(".reel-video");
        if (v && (v.error || v.networkState === 3)) return false; // failed / no source
        return true;
      })
      .map((c) => c.dataset.src);

    const centerIndex = () => {
      if (!feed.clientHeight) return 0;
      return Math.max(0, Math.min(items.length - 1, Math.round(feed.scrollTop / feed.clientHeight)));
    };
    const playCentered = () => {
      const i = centerIndex();
      items.forEach((it, idx) => {
        const v = it.querySelector("video");
        if (!v) return;
        if (idx === i) { v.play().catch(() => {}); } else { v.pause(); v.currentTime = 0; }
      });
    };
    const goTo = (i) => {
      if (i < 0 || i >= items.length) return;
      // try native smooth; falls back to the instant set on engines that ignore it
      try { feed.scrollTo({ top: i * feed.clientHeight, behavior: "smooth" }); } catch (e) {}
      feed.scrollTop = i * feed.clientHeight;
      setTimeout(playCentered, 80);
    };

    const open = (src) => {
      const list = sources();
      if (!list.length) return;
      let pos = list.indexOf(src);
      if (pos < 0) pos = 0;
      feed.innerHTML = list
        .map((s) => '<div class="rv-item"><video src="' + s + '" playsinline preload="metadata" loop></video><span class="rv-pause" aria-hidden="true"><i class="fa-solid fa-play"></i></span></div>')
        .join("");
      items = Array.from(feed.querySelectorAll(".rv-item"));
      // tap a video to toggle play / pause; drop any that fail to load
      feed.querySelectorAll("video").forEach((v) => {
        v.addEventListener("click", () => {
          if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
        });
        v.addEventListener("play", () => v.parentElement.classList.remove("paused"));
        v.addEventListener("pause", () => v.parentElement.classList.add("paused"));
        v.addEventListener("error", () => {
          const it = v.closest(".rv-item");
          if (it) { it.remove(); items = Array.from(feed.querySelectorAll(".rv-item")); }
        });
      });
      viewer.classList.add("open");
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        feed.scrollTop = pos * feed.clientHeight;
        setTimeout(playCentered, 80);
      });
    };
    const close = () => {
      viewer.classList.remove("open");
      document.body.style.overflow = "";
      feed.querySelectorAll("video").forEach((v) => v.pause());
      feed.innerHTML = "";
      items = [];
    };

    cards.forEach((c) => {
      c.addEventListener("click", () => {
        if (c.classList.contains("is-empty") || !c.dataset.src) return;
        open(c.dataset.src);
      });
    });
    viewer.querySelector(".rv-close").addEventListener("click", close);
    viewer.querySelector(".rv-up").addEventListener("click", () => goTo(centerIndex() - 1));
    viewer.querySelector(".rv-down").addEventListener("click", () => goTo(centerIndex() + 1));

    let scrollTimer;
    feed.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(playCentered, 110);
    });
    document.addEventListener("keydown", (e) => {
      if (!viewer.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowDown") { e.preventDefault(); goTo(centerIndex() + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); goTo(centerIndex() - 1); }
    });
  }

  /* ---------- Specialised treatments tabs ---------- */
  const svcTabs = document.querySelector(".svc-tabs");
  if (svcTabs) {
    const tabs = Array.from(svcTabs.querySelectorAll(".svc-tab"));
    const panels = Array.from(svcTabs.querySelectorAll(".svc-panel"));

    function activate(id, focusTab) {
      tabs.forEach((t) => {
        const on = t.dataset.id === id;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focusTab) t.focus();
      });
      panels.forEach((p) => {
        const on = p.dataset.id === id;
        p.classList.toggle("is-active", on);
        p.hidden = !on;
      });
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab.dataset.id));
      tab.addEventListener("keydown", (e) => {
        let ni = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") ni = (i + 1) % tabs.length;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") ni = (i - 1 + tabs.length) % tabs.length;
        if (ni > -1) { e.preventDefault(); activate(tabs[ni].dataset.id, true); }
      });
    });
  }

  /* ---------- Scrolling testimonial columns ---------- */
  const tcols = document.querySelector(".tcols");
  if (tcols && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tcols.querySelectorAll(".tcol-track").forEach((track) => {
      track.innerHTML += track.innerHTML;   /* duplicate cards for seamless loop */
    });
  }

  /* ---------- Testimonials carousel (legacy, no-op if absent) ---------- */
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const slidesWrap = carousel.querySelector(".slides");
    const slides = Array.from(carousel.querySelectorAll(".slide"));
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");
    const dotsWrap = carousel.querySelector(".carousel-dots");
    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("active", di === index));
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));
    goTo(0);

    let timer = setInterval(() => goTo(index + 1), 6000);
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", () => (timer = setInterval(() => goTo(index + 1), 6000)));
  }

  /* ---------- Testimonial Read More / Less ---------- */
  document.querySelectorAll(".testimonial .read-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const quote = btn.previousElementSibling;
      const clamped = quote.classList.toggle("clamped");
      btn.textContent = clamped ? "Read More" : "Read Less";
    });
  });

  /* ---------- Appointment form (front-end only) ---------- */
  const form = document.querySelector("#appointment-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = form.querySelector(".form-success");
      if (msg) {
        msg.style.display = "block";
        form.reset();
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Gallery lightbox ---------- */
  const galleryGrid = document.querySelector(".gallery-grid");
  if (galleryGrid) {
    const items = Array.from(galleryGrid.querySelectorAll(".gallery-item"));
    if (items.length) {
      const lb = document.createElement("div");
      lb.className = "lightbox";
      lb.setAttribute("role", "dialog");
      lb.setAttribute("aria-modal", "true");
      lb.innerHTML =
        '<button class="lb-close" aria-label="Close">&times;</button>' +
        '<button class="lb-nav prev" aria-label="Previous">&#10094;</button>' +
        '<button class="lb-nav next" aria-label="Next">&#10095;</button>' +
        '<div class="lb-stage"></div>' +
        '<div class="lb-caption"></div>';
      document.body.appendChild(lb);

      const stage = lb.querySelector(".lb-stage");
      const caption = lb.querySelector(".lb-caption");
      let current = 0;

      function render(i) {
        current = (i + items.length) % items.length;
        const item = items[current];
        const img = item.querySelector("img");
        const cap = item.getAttribute("data-caption") || (img ? img.alt : "");
        stage.innerHTML = "";
        if (img) {
          const big = document.createElement("img");
          big.className = "lb-content";
          big.src = img.getAttribute("data-full") || img.src;
          big.alt = cap;
          stage.appendChild(big);
        } else {
          const ph = document.createElement("div");
          ph.className = "lb-content photo-placeholder";
          ph.style.width = "min(70vw, 700px)";
          ph.style.aspectRatio = "4/3";
          ph.textContent = cap;
          stage.appendChild(ph);
        }
        caption.textContent = cap;
      }
      function open(i) { render(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
      function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }

      items.forEach((item, i) => {
        item.setAttribute("tabindex", "0");
        item.addEventListener("click", () => open(i));
        item.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
      });
      lb.querySelector(".lb-close").addEventListener("click", close);
      lb.querySelector(".lb-nav.prev").addEventListener("click", () => render(current - 1));
      lb.querySelector(".lb-nav.next").addEventListener("click", () => render(current + 1));
      lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
      document.addEventListener("keydown", (e) => {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") render(current - 1);
        if (e.key === "ArrowRight") render(current + 1);
      });
    }
  }

  /* ---------- Scroll-reveal animations ---------- */
  const revealSingles = ".section-head, .about-grid, .location-block, .cta-banner, .form-card, .faq, .carousel, .prose";
  const revealGroups = ".card-grid, .trust-strip, .gallery-grid, .blog-grid";

  document.querySelectorAll(revealSingles).forEach((el) => el.classList.add("reveal"));
  document.querySelectorAll(revealGroups).forEach((el) => el.classList.add("reveal-stagger"));

  /* Side blocks use pure-CSS scroll-driven animation where supported; only
     fall back to the JS observer (with .js-anim) when it isn't. */
  const supportsScrollAnim = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  if (!supportsScrollAnim) {
    document.querySelectorAll(".reveal-left, .reveal-right").forEach((el) => el.classList.add("js-anim"));
  }
  const animated = document.querySelectorAll(
    ".reveal, .reveal-stagger" + (supportsScrollAnim ? "" : ", .reveal-left, .reveal-right")
  );
  if ("IntersectionObserver" in window && animated.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -70px 0px" }
    );
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("in-view"));
  }
});
