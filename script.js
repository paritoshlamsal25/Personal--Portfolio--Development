// ==========================================================================
// PARITOSH LAMSAL - MODERN PORTFOLIO INTERACTION ENGINE
// Clean, performant, mobile-optimized event handling and animations.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const backToTopBtn = document.getElementById('backToTop');
    const successModal = document.getElementById('successModal');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // --------------------------------------------------------------------------
    // 1. Navbar Glassmorphic Scroll Effect & Back-to-Top
    // --------------------------------------------------------------------------
    const handleScroll = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // Sticky Navbar Glass Effect
        if (navbar) {
            if (scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to Top Button
        if (backToTopBtn) {
            if (scrollY > 350) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }

        // Active Navigation Highlight
        updateActiveNavLink(scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --------------------------------------------------------------------------
    // 2. Active Link Highlighting
    // --------------------------------------------------------------------------
    function updateActiveNavLink(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // --------------------------------------------------------------------------
    // 3. Smooth Navigation & Mobile Menu Toggle
    // --------------------------------------------------------------------------
    function openMenu() {
        if (!navMenu) return;
        navMenu.classList.add('active');
        if (hamburger) hamburger.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!navMenu) return;
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            if (isActive) closeMenu();
            else openMenu();
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                closeMenu();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                closeMenu();
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // --------------------------------------------------------------------------
    // 4. Animated Stats Counter (Bento Stats)
    // --------------------------------------------------------------------------
    function animateCounter(element, target, duration = 1800, suffix = '') {
        let start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(easeOut * target);

            element.textContent = currentVal + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statCards = entry.target.querySelectorAll('.stat-item h3');
                statCards.forEach(item => {
                    const rawText = item.textContent.trim();
                    if (rawText.includes('8th')) {
                        item.textContent = '0th';
                        animateCounter(item, 8, 1600, 'th');
                    } else if (rawText.includes('10+')) {
                        item.textContent = '0+';
                        animateCounter(item, 10, 1600, '+');
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --------------------------------------------------------------------------
    // 5. Contact Form Validation & Formspree AJAX Submission
    // --------------------------------------------------------------------------
    if (contactForm) {
        setupRealTimeValidation();

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            [nameInput, emailInput, subjectInput, messageInput].forEach(clearValidation);

            let isValid = true;
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || name.length < 2) {
                showError(nameInput, 'Please enter a valid name (at least 2 letters)');
                isValid = false;
            } else {
                showSuccess(nameInput);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            if (!subject || subject.length < 3) {
                showError(subjectInput, 'Subject must be at least 3 characters');
                isValid = false;
            } else {
                showSuccess(subjectInput);
            }

            if (!message || message.length < 10) {
                showError(messageInput, 'Message must be at least 10 characters long');
                isValid = false;
            } else {
                showSuccess(messageInput);
            }

            if (!isValid) return;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showSuccessModal();
                    contactForm.reset();
                    [nameInput, emailInput, subjectInput, messageInput].forEach(clearValidation);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                showToastNotification('Could not send message. Please email me directly at paritoshlamsal25@gmail.com', 'error');
            } finally {
                submitBtn.innerHTML = originalBtnHTML;
                submitBtn.disabled = false;
            }
        });
    }

    function setupRealTimeValidation() {
        const inputs = [
            { id: 'name', validator: val => val.trim().length >= 2, msg: 'Name must have at least 2 characters' },
            { id: 'email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()), msg: 'Enter a valid email' },
            { id: 'subject', validator: val => val.trim().length >= 3, msg: 'Subject must be at least 3 characters' },
            { id: 'message', validator: val => val.trim().length >= 10, msg: 'Message must be at least 10 characters' }
        ];

        inputs.forEach(item => {
            const el = document.getElementById(item.id);
            if (!el) return;
            el.addEventListener('blur', () => {
                if (el.value.trim().length > 0) {
                    if (item.validator(el.value)) showSuccess(el);
                    else showError(el, item.msg);
                }
            });
            el.addEventListener('input', () => {
                if (el.classList.contains('error') && item.validator(el.value)) {
                    showSuccess(el);
                }
            });
        });
    }

    function showError(input, message) {
        if (!input) return;
        input.classList.add('error');
        input.classList.remove('success');
        let err = input.parentNode.querySelector('.error-message');
        if (!err) {
            err = document.createElement('div');
            err.className = 'error-message';
            input.parentNode.appendChild(err);
        }
        err.textContent = message;
    }

    function showSuccess(input) {
        if (!input) return;
        input.classList.add('success');
        input.classList.remove('error');
        const err = input.parentNode.querySelector('.error-message');
        if (err) err.remove();
    }

    function clearValidation(input) {
        if (!input) return;
        input.classList.remove('error', 'success');
        const err = input.parentNode.querySelector('.error-message');
        if (err) err.remove();
    }

    function showSuccessModal() {
        if (!successModal) return;
        successModal.classList.add('show');
        setTimeout(() => {
            successModal.classList.remove('show');
        }, 4500);
    }

    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('show');
            }
        });
    }

    function showToastNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.className = `notification ${type} show`;
        notif.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 4500);
    }

    // --------------------------------------------------------------------------
    // 6. Interactive 3D Tilt for Project Cards (Desktop only)
    // --------------------------------------------------------------------------
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});
