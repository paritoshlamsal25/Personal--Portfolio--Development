// Performance and SEO Tracking Script
// Add this to your script.js for better SEO performance

document.addEventListener('DOMContentLoaded', function() {
    // 1. Lazy Loading for Images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 2. Track User Engagement for SEO
    let timeOnPage = 0;
    const startTime = Date.now();
    
    // Track scroll depth
    let maxScrollPercentage = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
        
        if (scrollPercentage > maxScrollPercentage) {
            maxScrollPercentage = scrollPercentage;
        }
    });

    // 3. SEO-friendly smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page reload (good for SEO)
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // 4. Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'images/myphoto.jpg';
    preloadLink.as = 'image';
    document.head.appendChild(preloadLink);

    // 5. Service Worker for caching (PWA)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // 6. Track page performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            // Send to Google Analytics (replace with your GA4 ID)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    custom_parameter: loadTime
                });
            }
        }
    });

    // 7. Enhanced contact form tracking
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: 'contact_form'
                });
            }
        });
    }

    // 8. Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'outbound',
                    event_label: this.href
                });
            }
        });
    });
});

// 9. Critical CSS inlining function
function inlineCriticalCSS() {
    const criticalCSS = `
        /* Critical above-the-fold CSS */
        .navbar { position: fixed; top: 0; width: 100%; z-index: 1000; }
        .hero { min-height: 100vh; display: flex; align-items: center; }
        .hero-content { display: flex; align-items: center; max-width: 1200px; margin: 0 auto; }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
}

// 10. Schema.org structured data injection
function addStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Paritosh Lamsal Portfolio",
        "url": "https://paritoshlamsal25.github.io/Personal--Portfolio--Development/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://paritoshlamsal25.github.io/Personal--Portfolio--Development/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Initialize SEO enhancements
addStructuredData();
