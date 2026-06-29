// ============================================
// LAVISH WORLD - Branches Page JavaScript
// ============================================

(function() {
    "use strict";

    // ---------- DOM REFERENCES ----------
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('#themeToggle i');
    const themeText = document.querySelector('#themeToggle .theme-text');
    const toast = document.getElementById('toast');
    const branchModal = document.getElementById('branchModal');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ============================================
    // 1. DARK/LIGHT THEME TOGGLE
    // ============================================
    function initTheme() {
        const savedTheme = localStorage.getItem('lavishTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeUI(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('lavishTheme', newTheme);
                updateThemeUI(newTheme);
                
                showToast(
                    newTheme === 'dark' ? '🌙 Dark theme activated' : '☀️ Light theme activated',
                    'success'
                );
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
    // 2. TOAST NOTIFICATION
    // ============================================
    function showToast(message, type = 'success') {
        if (!toast) return;
        
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        toastIcon.textContent = icons[type] || '✨';
        toastMessage.textContent = message;
        toast.className = 'toast';
        toast.classList.add('show');
        
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ============================================
    // 3. BRANCH MODAL
    // ============================================
    window.showBranchDetails = function(name, type, address, phone, email) {
        if (!branchModal) return;
        
        document.getElementById('modalBranchName').textContent = name;
        document.getElementById('modalBranchType').textContent = type;
        document.getElementById('modalAddress').textContent = address;
        document.getElementById('modalPhone').textContent = phone;
        document.getElementById('modalEmail').textContent = email;
        
        branchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeBranchModal = function() {
        if (branchModal) {
            branchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && branchModal && branchModal.classList.contains('active')) {
            closeBranchModal();
        }
    });

    // Close modal when clicking outside
    if (branchModal) {
        branchModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBranchModal();
            }
        });
    }

    // ============================================
    // 4. STATISTICS COUNTER ANIMATION
    // ============================================
    function animateStats() {
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
    // 5. SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.branch-card, .stat-item, .map-section');
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
    // 6. BREADCRUMB NAVIGATION
    // ============================================
    function initBreadcrumb() {
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
        breadcrumbLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.classList.contains('active')) {
                    e.preventDefault();
                }
            });
        });
    }

    // ============================================
    // 7. KEYBOARD SHORTCUTS
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
            
            // Press '?' to show help
            if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                showKeyboardHelp();
            }
        });
    }

    // ============================================
    // 8. KEYBOARD HELP MODAL
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
                    <li><kbd>Esc</kbd> - Close modals</li>
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
        
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                helpModal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // ============================================
    // 9. VISITOR COUNTER
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
    // 10. CONSOLE WELCOME
    // ============================================
    function showConsoleWelcome() {
        console.log('✨ LAVISH WORLD - Branches Page ✨');
        console.log('📍 Find our branches across India');
        console.log('🌓 Press "T" to toggle Dark/Light theme');
        console.log('🏠 Press "Home" to scroll to top');
        console.log('🔚 Press "End" to scroll to bottom');
        console.log('❓ Press "?" for keyboard shortcuts help');
    }

    // ============================================
    // 11. ERROR HANDLING
    // ============================================
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('⚠️ Lavish World Error:', e.message);
        });
    }

    // ============================================
    // 12. PAGE TRANSITION
    // ============================================
    function initPageTransition() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.6s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 50);
    }

    // ============================================
    // 13. INITIALIZATION
    // ============================================
    function init() {
        // Theme
        initTheme();
        
        // Animations
        animateStats();
        initScrollAnimations();
        
        // Navigation
        initBreadcrumb();
        
        // Interactions
        initKeyboardShortcuts();
        
        // Analytics
        initVisitorCounter();
        initErrorHandling();
        initPageTransition();
        
        // Console
        showConsoleWelcome();
        
        document.dispatchEvent(new CustomEvent('lavishReady', {
            detail: { page: 'branches', version: '2.0', timestamp: new Date() }
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