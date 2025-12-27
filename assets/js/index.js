// ======================================================
// GLOBAL HELPERS
// ======================================================
const root = document.documentElement;


// ======================================================
// NAVBAR ACTIVE LINK ON SCROLL
// ======================================================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let currentId = "";

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 80) {
            currentId = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentId}`
        );
    });
});

// ======================================================
// FILTER FUNCTIONALITY FOR PROJECTS
// ======================================================
// Select all filter buttons and portfolio items
const filterButtons = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

// Add click event to each filter button
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        // Update button active state
        filterButtons.forEach(btn => {
            btn.classList.remove("active", "bg-linear-to-r", "from-primary", "to-secondary", "text-white");
            btn.classList.add("bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300");
            btn.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active", "bg-linear-to-r", "from-primary", "to-secondary", "text-white");
        button.setAttribute("aria-pressed", "true");

        // Show/hide items based on category
        portfolioItems.forEach(item => {
            const category = item.getAttribute("data-category");
            if (filter === "all" || category === filter) {
                item.classList.remove("hidden");
                item.classList.add("block"); // ensure visible
            } else {
                item.classList.add("hidden");
                item.classList.remove("block");
            }
        });
    });
});

// ======================================================
// TESTIMONIALS CAROUSEL
// ======================================================
const carousel = document.getElementById("testimonials-carousel");
const cards = Array.from(document.querySelectorAll(".testimonial-card"));
const dots = Array.from(document.querySelectorAll(".carousel-indicator"));
const prevBtn = document.getElementById("prev-testimonial");
const nextBtn = document.getElementById("next-testimonial");

let index = 0;
let autoSlideTimer = null;

const getVisibleCards = () => {
    const w = window.innerWidth;
    if (w >= 1920) return 6;
    if (w >= 1440) return 4;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
};

const getMaxIndex = () =>
    Math.max(0, cards.length - getVisibleCards());

function updateDots() {
    if (!dots.length) return;

    const maxIndex = getMaxIndex();
    const step = dots.length > 1
        ? Math.ceil(maxIndex / (dots.length - 1))
        : 0;

    const active = step ? Math.round(index / step) : 0;

    dots.forEach((dot, i) => {
        dot.classList.toggle("bg-accent", i === active);
        dot.classList.toggle("bg-slate-400", i !== active);
        dot.setAttribute("aria-selected", i === active);
    });
}

function slideCarousel(animate = true) {
    const visible = getVisibleCards();
    const maxIndex = getMaxIndex();

    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;

    carousel.style.transition = animate ? "transform 0.5s ease" : "none";
    carousel.style.transform = `translateX(-${(index * 100) / visible}%)`;

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

autoSlideTimer = setInterval(nextSlide, 5000);
slideCarousel(false);


// ======================================================
// DARK / LIGHT MODE TOGGLE
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

document.addEventListener("click", e => {
    if (!sidebar.contains(e.target) && !openBtn.contains(e.target)) {
        closeSidebar();
    }
});

function closeSidebar() {
    sidebar.classList.add("translate-x-full");
    sidebar.inert = true;
    sidebar.setAttribute("aria-hidden", "true");
}


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

    fontOptions.forEach(btn => {
        const active = btn.dataset.font === font;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-checked", active);
    });
}

fontOptions.forEach(btn => {
    btn.addEventListener("click", () => applyFont(btn.dataset.font));
});

applyFont(localStorage.getItem("selectedFont") || DEFAULT_FONT);


// ======================================================
// COLOR THEMES
// ======================================================
const themes = [
    { name: "Purple Blue", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
    { name: "Pink Orange", primary: "#ec4899", secondary: "#f97316", accent: "#fb923c" },
    { name: "Green Emerald", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
    { name: "Blue Cyan", primary: "#3b82f6", secondary: "#06b6d4", accent: "#22d3ee" },
    { name: "Red Rose", primary: "#ef4444", secondary: "#f43f5e", accent: "#fb7185" },
    { name: "Amber Orange", primary: "#f59e0b", secondary: "#ea580c", accent: "#fbbf24" }
];

const DEFAULT_THEME = themes[0];

function applyColorTheme(theme) {
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-accent", theme.accent);

    localStorage.setItem("selectedTheme", JSON.stringify(theme));
}

themes.forEach(theme => {
    const btn = document.createElement("button");
    btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
    btn.className = "w-12 h-12 rounded-full border-2";
    btn.addEventListener("click", () => applyColorTheme(theme));
    colorsGrid.appendChild(btn);
});

applyColorTheme(
    JSON.parse(localStorage.getItem("selectedTheme")) || DEFAULT_THEME
);


// ======================================================
// SCROLL TO TOP BUTTON
// ======================================================
const scrollBtn = document.getElementById("scroll-to-top");

window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("opacity-100", window.scrollY > 300);
    scrollBtn.classList.toggle("visible", window.scrollY > 300);
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
