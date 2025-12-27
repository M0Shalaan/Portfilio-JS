// ^ Write your JavaScript code here

// make nav bar active while scrolling
// Get all sections
const sections = document.querySelectorAll("section");
// Get all nav links inside .nav-links
const navLinks = document.querySelectorAll(".nav-links a");
// Listen for scroll events
window.addEventListener("scroll", () => {
    let currentSectionId = "";

    // Detect current section
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;

        if (window.scrollY >= sectionTop - 80) {
            currentSectionId = section.id;
        }
    });

    // Update active class
    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSectionId}`) {
            link.classList.add("active");
        }
    });
});
// end of nav bar active while scrolling

// Testimonials Carousel Functionality



// Grab elements
const prevBtn = document.getElementById("prev-testimonial");
const nextBtn = document.getElementById("next-testimonial");
const carousel = document.getElementById("testimonials-carousel");
const cards = Array.from(document.querySelectorAll(".testimonial-card"));
const dots = Array.from(document.querySelectorAll(".carousel-indicator"));

let index = 0;
let autoSlideTimer = null;

// Determine how many cards are visible based on screen width
function getVisibleCards() {
    const width = window.innerWidth;
    if (width >= 1920) return 6;
    if (width >= 1440) return 4;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
}

// Calculate maximum index to prevent sliding beyond last card
function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCards());
}

// Move carousel to the correct position
function slideCarousel(animate = true) {
    const visible = getVisibleCards();
    const totalCards = cards.length;
    const maxIndex = totalCards - visible;

    // Loop index if out of bounds
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;

    // Slide the carousel
    carousel.style.transition = animate ? 'transform 0.5s ease' : 'none';
    carousel.style.transform = `translateX(-${(index * 100) / visible}%)`;

    updateDots();
}

// Update pagination dots
function updateDots() {
    if (!dots.length) return;

    const maxIndex = getMaxIndex();
    const step = dots.length > 1 ? Math.ceil(maxIndex / (dots.length - 1)) : 0;
    const activeDot = step ? Math.round(index / step) : 0;

    dots.forEach((dot, i) => {
        const isActive = i === activeDot;
        dot.classList.toggle("bg-accent", isActive);
        dot.classList.toggle("bg-slate-400", !isActive);
        dot.setAttribute("aria-selected", isActive);
    });
}

// Go to next slide
function nextSlide() {
    index++;
    if (index > getMaxIndex()) index = 0;
    slideCarousel();
}

// Go to previous slide
function prevSlide() {
    index--;
    if (index < 0) index = getMaxIndex();
    slideCarousel();
}

// Reset auto-slide timer when user interacts
function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 5000);
}

// Event listeners for buttons
nextBtn.addEventListener("click", () => { nextSlide(); resetAutoSlide(); });
prevBtn.addEventListener("click", () => { prevSlide(); resetAutoSlide(); });

// Event listeners for dots
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        if (dots.length <= 1) return;
        const step = Math.ceil(getMaxIndex() / (dots.length - 1));
        index = step * i;
        slideCarousel();
        resetAutoSlide();
    });
});

// Handle window resize
window.addEventListener("resize", () => {
    index = Math.min(index, getMaxIndex());
    slideCarousel(false);
});

// Initialize auto sliding
autoSlideTimer = setInterval(nextSlide, 5000);

// Initial render
slideCarousel(false);


// Toggle dark mode functionality

// Select the theme toggle button using a custom attribute
const themeToggleButton = document.querySelector("[theme-toggle-button]");

// Reference to the root <html> element (used by Tailwind / CSS dark mode)
const htmlElement = document.documentElement;

// Theme constants to avoid magic strings
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

/*
 * Determine the initial theme:
 * 1. Use saved theme from localStorage if it exists
 * 2. Otherwise, fall back to the user's system preference
 */
function getInitialTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? DARK_THEME
        : LIGHT_THEME;
}

/**
 * Apply the given theme to the document
 * and sync accessibility attributes
 */
function applyTheme(theme) {
    const isDark = theme === DARK_THEME;

    htmlElement.classList.toggle(DARK_THEME, isDark);
    localStorage.setItem("theme", theme);
    themeToggleButton.setAttribute("aria-pressed", String(isDark));
}

/**
 * Toggle between dark and light modes
 * Called when the user clicks the toggle button
 */
function toggleDarkMode() {
    const currentTheme = htmlElement.classList.contains(DARK_THEME)
        ? DARK_THEME
        : LIGHT_THEME;

    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    applyTheme(newTheme);
}

// Initialize theme once the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
});


// settings side bar
// open and close buttons

document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("settings-sidebar");
    const toggleBtn = document.getElementById("settings-toggle");
    const closeBtn = document.getElementById("close-settings");
    const resetBtn = document.getElementById("reset-settings");
    const fontOptions = document.querySelectorAll(".font-option");
    const colorsGrid = document.getElementById("theme-colors-grid");

    // ----- Theme Colors Definition -----
    const themes = [
        { name: "Purple Blue", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
        { name: "Pink Orange", primary: "#ec4899", secondary: "#f97316", accent: "#fb923c" },
        { name: "Green Emerald", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
        { name: "Blue Cyan", primary: "#3b82f6", secondary: "#06b6d4", accent: "#22d3ee" },
        { name: "Red Rose", primary: "#ef4444", secondary: "#f43f5e", accent: "#fb7185" },
        { name: "Amber Orange", primary: "#f59e0b", secondary: "#ea580c", accent: "#fbbf24" }
    ];

    const DEFAULT_FONT = "tajawal";
    const DEFAULT_THEME = themes[0];

    // ---------------- Sidebar Toggle ----------------
    function openSidebar() {
        sidebar.classList.remove("translate-x-full");
        sidebar.inert = false;
        sidebar.removeAttribute("aria-hidden");
        // focus first active font
        sidebar.querySelector(".font-option[aria-checked='true']")?.focus();
    }

    function closeSidebar() {
        sidebar.classList.add("translate-x-full");
        sidebar.inert = true;
        sidebar.setAttribute("aria-hidden", "true");
    }

    toggleBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    document.addEventListener("click", e => {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && !sidebar.classList.contains("translate-x-full")) {
            closeSidebar();
        }
    });

    // ---------------- Fonts Logic ----------------
    function applyFont(font) {
        document.body.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
        document.body.classList.add(`font-${font}`);
        fontOptions.forEach(btn => {
            const active = btn.dataset.font === font;
            btn.classList.toggle("active", active);
            btn.classList.toggle("border-primary", active);
            btn.setAttribute("aria-checked", active);
            if (active) btn.focus();
        });
        localStorage.setItem("selectedFont", font);
    }

    fontOptions.forEach(btn => {
        btn.addEventListener("click", () => applyFont(btn.dataset.font));
        btn.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); } });
    });

    // ---------------- Theme Colors Logic ----------------
    function applyTheme(theme) {
        document.documentElement.style.setProperty("--color-primary", theme.primary);
        document.documentElement.style.setProperty("--color-secondary", theme.secondary);
        document.documentElement.style.setProperty("--color-accent", theme.accent);

        Array.from(colorsGrid.children).forEach(btn => {
            const active = btn.dataset.primary === theme.primary && btn.dataset.secondary === theme.secondary;
            btn.classList.toggle("ring-2", active);
            btn.setAttribute("aria-checked", active);
            if (active) btn.focus();
        });
        localStorage.setItem("selectedTheme", JSON.stringify(theme));
    }

    themes.forEach(theme => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 transition-transform hover:scale-110";
        btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", "false");
        btn.setAttribute("title", theme.name);
        btn.dataset.primary = theme.primary;
        btn.dataset.secondary = theme.secondary;

        btn.addEventListener("click", () => applyTheme(theme));
        btn.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); } });

        colorsGrid.appendChild(btn);
    });

    // ---------------- Reset Button ----------------
    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("selectedFont");
        localStorage.removeItem("selectedTheme");
        applyFont(DEFAULT_FONT);
        applyTheme(DEFAULT_THEME);
        closeSidebar();
    });

    // ---------------- Load Saved Settings ----------------
    const savedFont = localStorage.getItem("selectedFont") || DEFAULT_FONT;
    const savedTheme = JSON.parse(localStorage.getItem("selectedTheme")) || DEFAULT_THEME;

    applyFont(savedFont);
    applyTheme(savedTheme);

});
// end of settings side bar