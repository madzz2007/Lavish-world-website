// ============================================
// CONTACT US PAGE - GOLDEN EDITION
// Light & Dark Theme Toggle
// ============================================

(function() {
    "use strict";

    // ---------- DOM REFERENCES ----------
    const themeToggle = document.getElementById('themeToggle');
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    // ---------- THEME TOGGLE ----------
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('contactTheme', newTheme);
        
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('.theme-text');
        
        if (newTheme === 'light') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark';
        }
        
        showToast(`Switched to ${newTheme} theme`, 'success');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('contactTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('.theme-text');
        
        if (savedTheme === 'light') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark';
        }
    }

    // ---------- TOAST ----------
    function showToast(message, type = 'info') {
        toast.className = 'toast';
        toast.classList.add(`toast-${type}`);
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        toastIcon.textContent = icons[type] || 'ℹ️';
        toastMessage.textContent = message;
        
        toast.classList.add('show');
        
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ---------- FORM HANDLING ----------
    function handleFormSubmit(event) {
        event.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const name = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate
        if (!name || !email || !subject || !message) {
            showToast('Please fill in all fields', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            return;
        }
        
        // Simulate sending (replace with actual API call)
        setTimeout(() => {
            showToast(`✨ Thank you ${name}! Your message has been sent.`, 'success');
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            contactForm.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }, 2000);
        }, 1500);
    }

    // ---------- SCROLL ANIMATIONS ----------
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.contact-card, .hours-card, .form-section, .map-section, .social-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    // ---------- KEYBOARD SHORTCUTS ----------
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // ---------- FORM INPUT VALIDATION ----------
    function initValidation() {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.01)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    // ---------- MAP INTERACTION ----------
    function initMapInteraction() {
        const mapContainer = document.querySelector('.map-container');
        const mapOverlay = document.querySelector('.map-overlay');
        
        if (mapContainer && mapOverlay) {
            mapContainer.addEventListener('mouseenter', function() {
                mapOverlay.style.opacity = '0';
                mapOverlay.style.transition = 'opacity 0.3s ease';
            });
            
            mapContainer.addEventListener('mouseleave', function() {
                mapOverlay.style.opacity = '1';
            });
        }
    }

    // ---------- INITIALIZATION ----------
    function init() {
        loadTheme();
        initScrollAnimations();
        initValidation();
        initMapInteraction();
        
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }
        
        console.log('✨ Contact Page - Golden Edition initialized');
        console.log('📋 Shortcuts: Alt+T (theme)');
        console.log('📧 Get in touch with us today!');
    }

    // ---------- EVENT LISTENERS ----------
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ---------- START ----------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();