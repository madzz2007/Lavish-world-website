// ============================================
// LAVISH WORLD - GOLDEN EDITION
// Complete JavaScript Functionality
// ============================================

(function() {
    "use strict";

    // ---------- DOM REFERENCES ----------
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.getElementById('backToTop');
    const statNumbers = document.querySelectorAll('.stat-number');
    const dateDisplay = document.getElementById('currentDate');
    const timeDisplay = document.getElementById('currentTime');
    const userGreeting = document.getElementById('userGreeting');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    // ============================================
    // 1. DARK/LIGHT THEME TOGGLE
    // ============================================
    function initTheme() {
        // Check saved theme
        const savedTheme = localStorage.getItem('lavishTheme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeUI(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('lavishTheme', newTheme);
                updateThemeUI(newTheme);
            });
        }
    }

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (themeText) themeText.textContent = 'Light';
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (themeText) themeText.textContent = 'Dark';
        }
    }

    // ============================================
    // 2. MOBILE MENU
    // ============================================
    function initMobileMenu() {
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('open');
                const icon = this.querySelector('i');
                if (navLinks.classList.contains('open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const header = document.querySelector('.header');
                if (header && !header.contains(event.target) && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    const icon = menuToggle.querySelector('i');
                    icon.className = 'fas fa-bars';
                }
            });

            // Close menu when clicking a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('open');
                    const icon = menuToggle.querySelector('i');
                    icon.className = 'fas fa-bars';
                });
            });
        }
    }

    // ============================================
    // 3. BACK TO TOP
    // ============================================
    function initBackToTop() {
        if (backToTop) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 400) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ============================================
    // 4. DATE & TIME
    // ============================================
    function updateDateTime() {
        const now = new Date();
        
        const dateOptions = { 
            weekday: 'short',
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
        };
        if (dateDisplay) {
            dateDisplay.textContent = now.toLocaleDateString('en-US', dateOptions);
        }
        
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        if (timeDisplay) {
            timeDisplay.textContent = now.toLocaleTimeString('en-US', timeOptions);
        }
    }

    // ============================================
    // 5. USER GREETING
    // ============================================
    function updateGreeting() {
        const hours = new Date().getHours();
        let greeting = '';
        let emoji = '';
        
        if (hours < 5) {
            greeting = 'Late Night';
            emoji = '🌃';
        } else if (hours < 12) {
            greeting = 'Good Morning';
            emoji = '🌅';
        } else if (hours < 17) {
            greeting = 'Good Afternoon';
            emoji = '☀️';
        } else if (hours < 21) {
            greeting = 'Good Evening';
            emoji = '🌆';
        } else {
            greeting = 'Good Night';
            emoji = '🌙';
        }
        
        if (userGreeting) {
            userGreeting.innerHTML = `${emoji} ${greeting}, <span style="color:#d4af37;">Welcome to LAVISH WORLD</span>`;
        }
    }

    // ============================================
    // 6. STATISTICS COUNTER ANIMATION
    // ============================================
    function animateCounters() {
        if (statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    let current = 0;
                    const increment = Math.ceil(target / 50);
                    const duration = 2000;
                    const stepTime = duration / 50;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        entry.target.textContent = current;
                    }, stepTime);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    // ============================================
    // 7. PRODUCT HOVER EFFECT
    // ============================================
    function initializeProductEffects() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.transition = 'transform 0.3s ease';
            });
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // ============================================
    // 8. NAVIGATION ACTIVE STATE
    // ============================================
    function setActiveNav() {
        const currentPath = window.location.pathname.split('/').pop() || 'Home.HTML';
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ============================================
    // 9. LAZY LOADING IMAGES
    // ============================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('.item-image img');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.6s ease';
                        setTimeout(() => {
                            img.style.opacity = '1';
                        }, 100);
                        imageObserver.unobserve(img);
                    }
                });
            }, { threshold: 0.1 });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // 10. SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.item, .stat-item, .footer-section');
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

    // ============================================
    // 11. SMOOTH SCROLL FOR HERO BUTTON
    // ============================================
    function initSmoothScroll() {
        const heroBtn = document.querySelector('.hero-btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }

        // Smooth scroll for all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const target = this.getAttribute('href');
                if (target !== '#') {
                    e.preventDefault();
                    const targetElement = document.querySelector(target);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // ============================================
    // 12. KEYBOARD SHORTCUTS
    // ============================================
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', function(event) {
            // Press 't' to toggle theme
            if ((event.key === 't' || event.key === 'T') && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                if (themeToggle) {
                    themeToggle.click();
                }
            }
            
            // Press 'Escape' to close mobile menu
            if (event.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
            
            // Press 'Home' key to scroll to top
            if (event.key === 'Home') {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // Press 'End' key to scroll to bottom
            if (event.key === 'End') {
                event.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });
    }

    // ============================================
    // 13. HANDLE WINDOW RESIZE
    // ============================================
    function initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // If window is resized to desktop size, close mobile menu
                if (window.innerWidth > 768 && navLinks) {
                    navLinks.classList.remove('open');
                    if (menuToggle) {
                        const icon = menuToggle.querySelector('i');
                        icon.className = 'fas fa-bars';
                    }
                }
            }, 250);
        });
    }

    // ============================================
    // 14. THEME TRANSITION CLASS
    // ============================================
    function initThemeTransition() {
        document.body.classList.add('theme-transition');
    }

    // ============================================
    // 15. VISITOR COUNTER
    // ============================================
    function initVisitorCounter() {
        let visitors = parseInt(localStorage.getItem('lavishVisitors') || '0');
        visitors++;
        localStorage.setItem('lavishVisitors', visitors);
        
        const footerBottom = document.querySelector('.footer-bottom');
        if (footerBottom) {
            const visitorEl = document.createElement('p');
            visitorEl.style.cssText = `
                color: rgba(255,255,255,0.08);
                font-size: 0.7rem;
                margin-top: 8px;
                letter-spacing: 1px;
            `;
            visitorEl.innerHTML = `👑 ${visitors.toLocaleString()} visitors have explored Lavish World`;
            footerBottom.appendChild(visitorEl);
        }
    }

    // ============================================
    // 16. CONSOLE WELCOME
    // ============================================
    function showConsoleWelcome() {
        console.log('✨ LAVISH WORLD - Golden Edition ✨');
        console.log('🌓 Press "T" to toggle Dark/Light theme');
        console.log('🏠 Press "Home" to scroll to top');
        console.log('🔚 Press "End" to scroll to bottom');
        console.log('❓ Press "?" for keyboard shortcuts help');
        console.log('📱 Responsive design with mobile menu support');
        console.log('👑 Welcome to elegance.');
    }

    // ============================================
    // 17. KEYBOARD HELP MODAL
    // ============================================
    function showKeyboardHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="help-content">
                <button class="help-close">&times;</button>
                <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                <ul>
                    <li><kbd>T</kbd> - Toggle Dark/Light Theme</li>
                    <li><kbd>Home</kbd> - Scroll to top</li>
                    <li><kbd>End</kbd> - Scroll to bottom</li>
                    <li><kbd>Esc</kbd> - Close mobile menu</li>
                    <li><kbd>?</kbd> - Show this help</li>
                </ul>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(10, 8, 6, 0.95);
                backdrop-filter: blur(15px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: helpFadeIn 0.3s ease;
            }
            
            @keyframes helpFadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            
            .help-content {
                background: linear-gradient(145deg, #1a1512, #0a0806);
                border: 1px solid rgba(212, 175, 55, 0.15);
                border-radius: 16px;
                padding: 35px 40px;
                max-width: 420px;
                width: 90%;
                position: relative;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
            }
            
            .help-content h3 {
                color: #d4af37;
                font-size: 1.5rem;
                margin-bottom: 20px;
                text-align: center;
                letter-spacing: 1px;
            }
            
            .help-content h3 i {
                margin-right: 10px;
            }
            
            .help-content ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .help-content li {
                color: rgba(245, 230, 200, 0.7);
                padding: 10px 0;
                border-bottom: 1px solid rgba(212, 175, 55, 0.05);
                font-size: 0.95rem;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .help-content li:last-child {
                border-bottom: none;
            }
            
            kbd {
                background: rgba(212, 175, 55, 0.1);
                color: #d4af37;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-family: monospace;
                border: 1px solid rgba(212, 175, 55, 0.15);
                min-width: 60px;
                text-align: center;
                font-weight: 600;
            }
            
            .help-close {
                position: absolute;
                top: 12px;
                right: 16px;
                background: none;
                border: none;
                color: rgba(245, 230, 200, 0.2);
                font-size: 1.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
                line-height: 1;
            }
            
            .help-close:hover {
                color: #d4af37;
                transform: rotate(90deg);
            }
            
            @media (max-width: 600px) {
                .help-content {
                    padding: 25px 20px;
                }
                .help-content h3 {
                    font-size: 1.2rem;
                }
                .help-content li {
                    font-size: 0.85rem;
                }
                kbd {
                    min-width: 50px;
                    font-size: 0.7rem;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(helpModal);
        
        const closeBtn = helpModal.querySelector('.help-close');
        closeBtn.addEventListener('click', function() {
            helpModal.remove();
        });
        
        helpModal.addEventListener('click', function(e) {
            if (e.target === this) {
                helpModal.remove();
            }
        });
        
        // Close with Escape key
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                helpModal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // ============================================
    // 18. PRODUCT CARD RIPPLE EFFECT
    // ============================================
    function initRippleEffect() {
        const items = document.querySelectorAll('.item');
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: rgba(212, 175, 55, 0.1);
                    left: ${x - 50}px;
                    top: ${y - 50}px;
                    transform: scale(0);
                    animation: rippleAnim 0.6s ease forwards;
                    pointer-events: none;
                    z-index: 10;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleAnim {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // 19. ERROR HANDLING
    // ============================================
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('⚠️ Lavish World Error:', e.message);
        });
    }

    // ============================================
    // 20. INITIALIZATION
    // ============================================
    function init() {
        // Theme
        initTheme();
        initThemeTransition();
        
        // Navigation
        initMobileMenu();
        setActiveNav();
        
        // UI Effects
        initBackToTop();
        initializeProductEffects();
        initRippleEffect();
        initLazyLoading();
        initScrollAnimations();
        
        // Content
        updateDateTime();
        setInterval(updateDateTime, 1000);
        updateGreeting();
        
        // Stats
        animateCounters();
        
        // Interactions
        initSmoothScroll();
        initKeyboardShortcuts();
        initResizeHandler();
        
        // Analytics
        initVisitorCounter();
        initErrorHandling();
        
        // Keyboard Help
        document.addEventListener('keydown', function(e) {
            if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                showKeyboardHelp();
            }
        });
        
        // Console
        showConsoleWelcome();
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('lavishReady', {
            detail: { version: '2.0', timestamp: new Date() }
        }));
    }

    // ============================================
    // START APP
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();