// ======================================================
// GLOBAL HELPERS
// ======================================================

// Root element (used for theme colors & dark mode)
const root = document.documentElement;

// ======================================================
// NAVBAR ACTIVE LINK ON SCROLL (OPTIMIZED)
// ======================================================

// Cache sections and nav links once
const sections = [...document.querySelectorAll("section")];
const navLinks = [...document.querySelectorAll(".nav-links a")];

// Store section positions to avoid layout reads on scroll
let sectionPositions = [];

// Calculate section positions
function cacheSectionPositions() {
  sectionPositions = sections.map((section) => ({
    id: section.id,
    top: section.offsetTop - 100, // small offset for navbar height
  }));
}

cacheSectionPositions();
window.addEventListener("resize", cacheSectionPositions);

// ======================================================
// PORTFOLIO FILTER FUNCTIONALITY
// ======================================================

const filterButtons = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    // Update filter buttons UI
    filterButtons.forEach((btn) => {
      btn.classList.remove(
        "active",
        "bg-linear-to-r",
        "from-primary",
        "to-secondary",
        "text-white"
      );
      btn.classList.add(
        "bg-white",
        "dark:bg-slate-800",
        "text-slate-600",
        "dark:text-slate-300"
      );
      btn.setAttribute("aria-pressed", "false");
    });

    button.classList.add(
      "active",
      "bg-linear-to-r",
      "from-primary",
      "to-secondary",
      "text-white"
    );
    button.setAttribute("aria-pressed", "true");

    // Show / hide portfolio items
    portfolioItems.forEach((item) => {
      const match = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !match);
    });
  });
});

// ======================================================
// TESTIMONIALS CAROUSEL
// ======================================================

const carousel = document.getElementById("testimonials-carousel");
const cards = [...document.querySelectorAll(".testimonial-card")];
const dots = [...document.querySelectorAll(".carousel-indicator")];
const prevBtn = document.getElementById("prev-testimonial");
const nextBtn = document.getElementById("next-testimonial");

let index = 0;
let autoSlideTimer = null;

// Decide how many cards should be visible based on screen width
function getVisibleCards() {
  const w = window.innerWidth;
  if (w >= 1920) return 6;
  if (w >= 1440) return 4;
  if (w >= 1024) return 3;
  if (w >= 768) return 2;
  return 1;
}

function getMaxIndex() {
  return Math.max(0, cards.length - getVisibleCards());
}

// Update carousel dots state
function updateDots() {
  if (!dots.length) return;

  const maxIndex = getMaxIndex();
  const step = dots.length > 1 ? Math.ceil(maxIndex / (dots.length - 1)) : 0;

  const active = step ? Math.round(index / step) : 0;

  dots.forEach((dot, i) => {
    dot.classList.toggle("bg-accent", i === active);
    dot.classList.toggle("bg-slate-400", i !== active);
    dot.setAttribute("aria-selected", i === active);
  });
}

// Move carousel
function slideCarousel(animate = true) {
  index = Math.max(0, Math.min(index, getMaxIndex()));

  carousel.style.transition = animate ? "transform 0.5s ease" : "none";

  carousel.style.transform = `translateX(-${
    (index * 100) / getVisibleCards()
  }%)`;

  updateDots();
}

function nextSlide() {
  index++;
  slideCarousel();
}

function prevSlide() {
  index--;
  slideCarousel();
}

// Auto slide handling
function resetAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(nextSlide, 5000);
}

nextBtn.addEventListener("click", () => {
  nextSlide();
  resetAutoSlide();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  resetAutoSlide();
});

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    if (dots.length <= 1) return;

    const step = Math.ceil(getMaxIndex() / (dots.length - 1));
    index = step * i;
    slideCarousel();
    resetAutoSlide();
  });
});

window.addEventListener("resize", () => {
  index = Math.min(index, getMaxIndex());
  slideCarousel(false);
});

resetAutoSlide();
slideCarousel(false);

// ======================================================
// DARK / LIGHT MODE
// ======================================================

const themeToggleBtn = document.querySelector("[theme-toggle-button]");
const THEME_KEY = "theme";

function applyMode(mode) {
  const isDark = mode === "dark";
  root.classList.toggle("dark", isDark);
  themeToggleBtn.setAttribute("aria-pressed", isDark);
  localStorage.setItem(THEME_KEY, mode);
}

function initThemeMode() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyMode(saved || (prefersDark ? "dark" : "light"));
}

function toggleDarkMode() {
  applyMode(root.classList.contains("dark") ? "light" : "dark");
}

initThemeMode();

// ======================================================
// SETTINGS SIDEBAR
// ======================================================

const sidebar = document.getElementById("settings-sidebar");
const openBtn = document.getElementById("settings-toggle");
const closeBtn = document.getElementById("close-settings");
const resetBtn = document.getElementById("reset-settings");
const fontOptions = document.querySelectorAll(".font-option");
const colorsGrid = document.getElementById("theme-colors-grid");

openBtn.addEventListener("click", () => {
  sidebar.classList.remove("translate-x-full");
  sidebar.inert = false;
  sidebar.removeAttribute("aria-hidden");
});

closeBtn.addEventListener("click", closeSidebar);

// Close sidebar safely (accessibility-friendly)
function closeSidebar() {
  if (sidebar.contains(document.activeElement)) {
    document.activeElement.blur();
    openBtn.focus();
  }

  sidebar.classList.add("translate-x-full");
  sidebar.inert = true;
  sidebar.setAttribute("aria-hidden", "true");
}

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !openBtn.contains(e.target)) {
    closeSidebar();
  }
});

// ======================================================
// FONT SETTINGS
// ======================================================

const DEFAULT_FONT = "tajawal";

function applyFont(font) {
  document.body.classList.remove(
    "font-alexandria",
    "font-tajawal",
    "font-cairo"
  );

  document.body.classList.add(`font-${font}`);
  localStorage.setItem("selectedFont", font);

  fontOptions.forEach((btn) => {
    const active = btn.dataset.font === font;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-checked", active);
  });
}

fontOptions.forEach((btn) =>
  btn.addEventListener("click", () => applyFont(btn.dataset.font))
);

applyFont(localStorage.getItem("selectedFont") || DEFAULT_FONT);

// ======================================================
// COLOR THEMES
// ======================================================

const themes = [
  {
    name: "Purple Blue",
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#a855f7",
  },
  {
    name: "Pink Orange",
    primary: "#ec4899",
    secondary: "#f97316",
    accent: "#fb923c",
  },
  {
    name: "Green Emerald",
    primary: "#10b981",
    secondary: "#059669",
    accent: "#34d399",
  },
  {
    name: "Blue Cyan",
    primary: "#3b82f6",
    secondary: "#06b6d4",
    accent: "#22d3ee",
  },
  {
    name: "Red Rose",
    primary: "#ef4444",
    secondary: "#f43f5e",
    accent: "#fb7185",
  },
  {
    name: "Amber Orange",
    primary: "#f59e0b",
    secondary: "#ea580c",
    accent: "#fbbf24",
  },
];

const DEFAULT_THEME = themes[0];

function applyColorTheme(theme) {
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-secondary", theme.secondary);
  root.style.setProperty("--color-accent", theme.accent);

  localStorage.setItem("selectedTheme", JSON.stringify(theme));

  [...colorsGrid.children].forEach((btn) =>
    btn.classList.toggle("ring-2", btn.dataset.name === theme.name)
  );
}

// Create color buttons dynamically
themes.forEach((theme) => {
  const btn = document.createElement("button");
  btn.dataset.name = theme.name;
  btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
  btn.className = "w-12 h-12 rounded-full border-2";
  btn.addEventListener("click", () => applyColorTheme(theme));
  colorsGrid.appendChild(btn);
});

applyColorTheme(
  JSON.parse(localStorage.getItem("selectedTheme")) || DEFAULT_THEME
);

// ======================================================
// RESET SETTINGS (COLOR + FONT ONLY)
// ======================================================

resetBtn.addEventListener("click", () => {
  requestAnimationFrame(() => {
    localStorage.removeItem("selectedFont");
    localStorage.removeItem("selectedTheme");

    applyFont(DEFAULT_FONT);
    applyColorTheme(DEFAULT_THEME);

    closeSidebar();
  });
});

// ======================================================
// SCROLL HANDLER (NAV + SCROLL TO TOP)
// ======================================================

const scrollBtn = document.getElementById("scroll-to-top");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;

      // Navbar active link
      const current = sectionPositions.findLast((sec) => y >= sec.top);

      navLinks.forEach((link) =>
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${current?.id}`
        )
      );

      // Scroll-to-top button
      scrollBtn.classList.toggle("opacity-100", y > 300);
      scrollBtn.classList.toggle("visible", y > 300);

      ticking = false;
    });
    ticking = true;
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
