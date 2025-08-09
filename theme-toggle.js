// Theme Toggle Functionality
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // Load saved theme or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener for theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Update theme toggle button on load
        this.updateToggleButton();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleButton();
        
        // Add smooth transition animation
        document.body.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 400);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a small animation feedback
        this.animateToggle();
    }

    updateToggleButton() {
        if (!this.themeToggle) return;
        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const sunIcon = this.themeToggle.querySelector('.fa-sun');
        const moonIcon = this.themeToggle.querySelector('.fa-moon');
        
        if (currentTheme === 'dark') {
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
            if (sunIcon) {
                sunIcon.style.opacity = '0';
                sunIcon.style.transform = 'rotate(180deg)';
            }
            if (moonIcon) {
                moonIcon.style.opacity = '1';
                moonIcon.style.transform = 'rotate(0deg)';
            }
        } else {
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            if (sunIcon) {
                sunIcon.style.opacity = '1';
                sunIcon.style.transform = 'rotate(0deg)';
            }
            if (moonIcon) {
                moonIcon.style.opacity = '0';
                moonIcon.style.transform = 'rotate(-180deg)';
            }
        }
    }

    animateToggle() {
        if (!this.themeToggle) return;
        
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Handle system theme preference changes
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if no user preference is saved
        if (!localStorage.getItem('theme')) {
            const theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
        }
    });
}
