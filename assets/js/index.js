
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

    const newTheme =
        currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    applyTheme(newTheme);
}

// Initialize theme once the DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
    const initialTheme = getInitialTheme();
    applyTheme(initialTheme);
});

