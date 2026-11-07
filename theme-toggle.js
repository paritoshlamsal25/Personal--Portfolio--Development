// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // Default to dark mode for modern developer vibe unless user saved a preference
        const savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            this.setTheme('dark');
        } else {
            this.setTheme(savedTheme);
        }
        
        // Add event listener for theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        this.updateToggleButton();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleButton();
        
        // Smooth transition
        document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 400);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.animateToggle();
    }

    updateToggleButton() {
        if (!this.themeToggle) return;
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        if (currentTheme === 'dark') {
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
            this.themeToggle.setAttribute('title', 'Switch to light mode');
        } else {
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            this.themeToggle.setAttribute('title', 'Switch to dark mode');
        }
    }

    animateToggle() {
        if (!this.themeToggle) return;
        this.themeToggle.style.transform = 'scale(0.88)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 150);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Handle system theme preference changes if user hasn't explicitly chosen
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
        }
    });
}
