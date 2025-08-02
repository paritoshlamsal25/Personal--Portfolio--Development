// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const backToTopBtn = document.getElementById('backToTop');
const successModal = document.getElementById('successModal');

// Simple scroll effect - only for back to top button
window.addEventListener('scroll', () => {
    // Back to Top Button functionality only
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Open mobile menu
function openMenu() {
    navMenu.classList.add('active');
    hamburger.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
}

// Close mobile menu
function closeMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Close mobile menu when clicking on overlay
if (navOverlay) {
    navOverlay.addEventListener('click', () => {
        closeMenu();
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// Touch support for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll - maintain black theme
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%)';
        navbar.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.4)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%)';
        navbar.style.boxShadow = '0 4px 25px rgba(0, 0, 0, 0.3)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Contact form handling
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form inputs
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('_replyto');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Clear previous validations
    [nameInput, emailInput, subjectInput, messageInput].forEach(clearValidation);
    
    let isValid = true;
    
    // Validate all fields
    if (!name || !validateName(name)) {
        showError(nameInput, !name ? 'Name is required' : 'Please enter a valid name (letters only, no numbers)');
        isValid = false;
    } else {
        showSuccess(nameInput);
    }
    
    if (!email || !validateEmail(email)) {
        showError(emailInput, !email ? 'Email is required' : 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess(emailInput);
    }
    
    if (!subject || !validateSubject(subject)) {
        showError(subjectInput, !subject ? 'Subject is required' : 'Subject must be at least 3 characters long');
        isValid = false;
    } else {
        showSuccess(subjectInput);
    }
    
    if (!message || !validateMessage(message)) {
        showError(messageInput, !message ? 'Message is required' : 'Message must be at least 10 characters long');
        isValid = false;
    } else {
        showSuccess(messageInput);
    }
    
    if (!isValid) {
        // Focus on first error field
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Submit to Formspree
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showSuccessModal();
            contactForm.reset();
            // Clear all validations after reset
            [nameInput, emailInput, subjectInput, messageInput].forEach(clearValidation);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        showNotification('Sorry, there was an error sending your message. Please try again or contact me directly via email.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateName(name) {
    const trimmedName = name.trim();
    
    // Name should be at least 2 characters long
    if (trimmedName.length < 2) {
        return false;
    }
    
    // Name should only contain letters, spaces, hyphens, and apostrophes
    // This regex allows: letters (a-z, A-Z), spaces, hyphens (-), apostrophes ('), and accented characters
    const nameRegex = /^[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF\s'-]+$/;
    
    if (!nameRegex.test(trimmedName)) {
        return false;
    }
    
    // Name shouldn't be just spaces, hyphens, or apostrophes
    const hasLetters = /[a-zA-ZÀ-ÿ\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]/.test(trimmedName);
    
    return hasLetters;
}

function validateSubject(subject) {
    return subject.trim().length >= 3;
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function showError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');
    
    let errorElement = input.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(input) {
    input.classList.add('success');
    input.classList.remove('error');
    
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearValidation(input) {
    input.classList.remove('error', 'success');
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Real-time validation setup
function setupRealTimeValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            if (nameInput.value.trim()) {
                if (validateName(nameInput.value)) {
                    showSuccess(nameInput);
                } else {
                    showError(nameInput, 'Please enter a valid name (letters only, no numbers)');
                }
            }
        });
        
        nameInput.addEventListener('input', () => {
            if (nameInput.classList.contains('error') && validateName(nameInput.value)) {
                showSuccess(nameInput);
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value.trim()) {
                if (validateEmail(emailInput.value)) {
                    showSuccess(emailInput);
                } else {
                    showError(emailInput, 'Please enter a valid email address');
                }
            }
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error') && validateEmail(emailInput.value)) {
                showSuccess(emailInput);
            }
        });
    }

    if (subjectInput) {
        subjectInput.addEventListener('blur', () => {
            if (subjectInput.value.trim()) {
                if (validateSubject(subjectInput.value)) {
                    showSuccess(subjectInput);
                } else {
                    showError(subjectInput, 'Subject must be at least 3 characters long');
                }
            }
        });
        
        subjectInput.addEventListener('input', () => {
            if (subjectInput.classList.contains('error') && validateSubject(subjectInput.value)) {
                showSuccess(subjectInput);
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            if (messageInput.value.trim()) {
                if (validateMessage(messageInput.value)) {
                    showSuccess(messageInput);
                } else {
                    showError(messageInput, 'Message must be at least 10 characters long');
                }
            }
        });
        
        messageInput.addEventListener('input', () => {
            if (messageInput.classList.contains('error') && validateMessage(messageInput.value)) {
                showSuccess(messageInput);
            }
        });
    }
}

// Email validation function
function isValidEmail(email) {
    return validateEmail(email);
}

// Success Modal Function
function showSuccessModal() {
    // Reset animations by removing and re-adding the modal
    successModal.classList.remove('show');
    
    // Force reflow to ensure the class removal takes effect
    successModal.offsetHeight;
    
    // Reset all checkmark animations
    const checkmarkElements = successModal.querySelectorAll('.checkmark-circle, .checkmark-stem, .checkmark-kick');
    checkmarkElements.forEach(element => {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = null;
    });
    
    // Show the modal
    setTimeout(() => {
        successModal.classList.add('show');
    }, 50);
    
    // Auto-hide after 4 seconds (increased to see full animation)
    setTimeout(() => {
        hideSuccessModal();
    }, 4000);
}

function hideSuccessModal() {
    successModal.classList.remove('show');
}

// Click outside modal to close
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        hideSuccessModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        hideSuccessModal();
    }
});

// Notification system
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 300px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .notification.success {
                background: #10b981;
            }
            
            .notification.error {
                background: #ef4444;
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
window.addEventListener('load', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Smooth scroll for scroll indicator
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({
        behavior: 'smooth'
    });
});

// Remove parallax effect that causes upward movement
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.hero');
//     if (hero) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Typewriter effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Special typewriter for HTML content
function typeWriterHTML(element, htmlContent, speed = 100) {
    // Parse the HTML to separate text from tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Extract text content and remember positions of tags
    let textContent = '';
    const tagPositions = [];
    
    function parseNode(node, currentPos = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            textContent += node.textContent;
            return currentPos + node.textContent.length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const startTag = `<${node.tagName.toLowerCase()}${node.className ? ` class="${node.className}"` : ''}>`;
            const endTag = `</${node.tagName.toLowerCase()}>`;
            
            tagPositions.push({ pos: currentPos, tag: startTag, type: 'open' });
            
            let newPos = currentPos;
            for (let child of node.childNodes) {
                newPos = parseNode(child, newPos);
            }
            
            tagPositions.push({ pos: newPos, tag: endTag, type: 'close' });
            return newPos;
        }
        return currentPos;
    }
    
    parseNode(tempDiv);
    
    // Now type character by character, inserting tags at the right positions
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < textContent.length) {
            // Check if we need to insert any tags at this position
            const tagsAtPosition = tagPositions.filter(tag => tag.pos === i);
            tagsAtPosition.forEach(tag => {
                element.innerHTML += tag.tag;
            });
            
            element.innerHTML += textContent.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Insert any remaining closing tags
            const remainingTags = tagPositions.filter(tag => tag.pos >= i);
            remainingTags.forEach(tag => {
                element.innerHTML += tag.tag;
            });
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        // Store the original HTML content
        const originalHTML = heroTitle.innerHTML;
        // Clear the content first
        heroTitle.innerHTML = '';
        
        // Start typing effect after a delay
        setTimeout(() => {
            typeWriterHTML(heroTitle, originalHTML, 80);
        }, 1000);
    }
});

// Skill items hover effect enhancement
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Project cards tilt effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.ceil(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Initialize counter animations when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item h3');
            statItems.forEach(item => {
                const text = item.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    item.textContent = '0';
                    setTimeout(() => {
                        animateCounter(item, number);
                    }, 500);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add loading screen with creative messaging
document.addEventListener('DOMContentLoaded', () => {
    // Create and show loader only after DOM is ready
    const loader = document.createElement('div');
    loader.id = 'loader';
    
    // Array of creative loading messages
    const loadingMessages = [
        "Crafting digital experiences...",
        "Brewing some awesome code ☕",
        "Preparing something amazing...",
        "Initializing creativity mode...",
        "Loading pixels with passion...",
        "Compiling dreams into reality...",
        "Building bridges to the future...",
        "Mixing code with creativity...",
        "Powering up the magic ✨"
    ];
    
    // Select a random message
    const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    
    loader.innerHTML = `
        <div class="loader-content">
            <div class="spinner"></div>
            <p class="loading-text">${randomMessage}</p>
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    const loaderStyles = document.createElement('style');
    loaderStyles.textContent = `
        #loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(135deg, 
                    #000000 0%,     /* Pure black */
                    #1a1a1a 25%,    /* Dark charcoal */
                    #2d2d2d 50%,    /* Medium charcoal */
                    #1a1a1a 75%,    /* Dark charcoal */
                    #000000 100%    /* Pure black */
                );
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .loader-content {
            text-align: center;
            color: white;
            animation: fadeInUp 0.8s ease;
        }
        
        .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top: 4px solid #ffffff;
            border-right: 4px solid #ffffff;
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
            margin: 0 auto 30px;
        }
        
        .loading-text {
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #ffffff;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            animation: textGlow 2s ease-in-out infinite alternate;
        }
        
        .loading-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
        }
        
        .loading-dots span {
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            animation: dotBounce 1.4s infinite ease-in-out both;
        }
        
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        .loading-dots span:nth-child(3) { animation-delay: 0s; }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes textGlow {
            from {
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 204, 0, 0.3);
            }
            to {
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 204, 0, 0.6);
            }
        }
        
        @keyframes dotBounce {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .loading-text {
                font-size: 1.1rem;
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border-width: 3px;
            }
        }
    `;
    
    document.head.appendChild(loaderStyles);
    document.body.appendChild(loader);
    
    // Remove loader after a reasonable time
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(loader)) {
                document.body.removeChild(loader);
            }
        }, 500);
    }, 1200); // Shows for 1.2 seconds + 0.5s fade out
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎉 Easter egg found! Welcome to the secret dev mode!', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);
        konamiCode = [];
    }
});

// Initialize real-time form validation
document.addEventListener('DOMContentLoaded', () => {
    setupRealTimeValidation();
});
