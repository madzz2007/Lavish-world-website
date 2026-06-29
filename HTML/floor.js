// ============================================
// FLOOR/MARBLE PAGE - GOLDEN EDITION (FIXED)
// ============================================

(function() {
    "use strict";

    // ---------- DOM REFERENCES ----------
    const themeToggle = document.getElementById('themeToggle');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('quickViewModal');
    const modalClose = document.querySelector('.modal-close');
    const modalAddToCart = document.getElementById('modalAddToCart');
    const toast = document.getElementById('toast');
    const toastMessage = toast ? toast.querySelector('.toast-message') : null;
    const toastIcon = toast ? toast.querySelector('.toast-icon') : null;

    // ---------- STATE ----------
    // FIXED: Shifted from 'marbleCart' to 'staircaseCart' for storage harmony
    let cartItems = JSON.parse(localStorage.getItem('staircaseCart') || '[]');
    let currentProductId = null;

    // ---------- THEME SYSTEM ----------
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('marbleTheme', newTheme);
        updateThemeUI(newTheme);
        showToast(`Switched to ${newTheme} theme`, 'success');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('marbleTheme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeUI(savedTheme);
    }

    function updateThemeUI(theme) {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('.theme-text');
        if (icon && text) {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            text.textContent = theme === 'light' ? 'Light' : 'Dark';
        }
    }

    // ---------- CART MANAGEMENT ----------
    function addToCart(productId) {
        const item = document.querySelector(`.item[data-id="${productId}"]`);
        if (!item) return;
        
        const name = item.dataset.name;
        const price = parseInt(item.dataset.price);
        
        // Grab latest local state values safely
        cartItems = JSON.parse(localStorage.getItem('staircaseCart') || '[]');
        
        const existing = cartItems.find(i => i.id === productId);
        if (existing) {
            existing.quantity += 1;
            showToast(`Added another ${name} to cart`, 'success');
        } else {
            cartItems.push({
                id: productId,
                name: name,
                price: price,
                quantity: 1
            });
            showToast(`Added ${name} to cart! ✨`, 'success');
        }
        
        saveAndSyncCart();
        animateCartButton(item);
    }

    function saveAndSyncCart() {
        // FIXED: Universal localstorage synchronization key mapping
        localStorage.setItem('staircaseCart', JSON.stringify(cartItems));
        updateCartBadgeCount();
    }

    // Updates cart amounts correctly across all components on the interface
    function updateCartBadgeCount() {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const countElements = document.querySelectorAll('#cartCount, .cart-count');
        
        countElements.forEach(el => {
            el.textContent = totalItems;
            el.style.transform = 'scale(1.3)';
            setTimeout(() => el.style.transform = 'scale(1)', 300);
        });
    }

    function animateCartButton(item) {
        const btn = item.querySelector('.add-to-cart');
        if (!btn) return;
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        }, 2000);
    }

    // ---------- WISHLIST ----------
    function toggleWishlist(btn) {
        btn.classList.toggle('liked');
        const icon = btn.querySelector('i');
        if (btn.classList.contains('liked')) {
            icon.className = 'fas fa-heart';
            showToast('Added to wishlist ❤️', 'success');
        } else {
            icon.className = 'far fa-heart';
            showToast('Removed from wishlist', 'info');
        }
    }

    // ---------- QUICK VIEW ----------
    function openQuickView(productId) {
        const item = document.querySelector(`.item[data-id="${productId}"]`);
        if (!item) return;
        
        document.getElementById('modalImage').src = item.querySelector('img').src;
        document.getElementById('modalTitle').textContent = item.querySelector('h3').textContent;
        document.getElementById('modalDescription').textContent = item.querySelector('.description').textContent;
        document.getElementById('modalPrice').textContent = item.querySelector('.price').textContent;
        
        if (document.getElementById('modalOriginalPrice') && item.querySelector('.original-price')) {
            document.getElementById('modalOriginalPrice').textContent = item.querySelector('.original-price').textContent;
        }
        
        currentProductId = productId;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeQuickView() {
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = '';
        currentProductId = null;
    }

    // ---------- TOAST SYSTEM ----------
    function showToast(message, type = 'info') {
        if (!toast || !toastMessage || !toastIcon) return;
        toast.className = `toast toast-${type}`;
        const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
        toastIcon.textContent = icons[type] || 'ℹ️';
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // ---------- EVENT LISTENERS ----------
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (modalClose) modalClose.addEventListener('click', closeQuickView);

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(this.dataset.id);
        });
    });

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleWishlist(this);
        });
    });

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.closest('.item').dataset.id;
            openQuickView(productId);
        });
    });

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeQuickView();
        });
    }

    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            if (currentProductId) {
                addToCart(currentProductId);
                closeQuickView();
            }
        });
    }

    // FIXED: Direct Routing configuration setup for Cart Redirection Targets
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    });

    // Storage update event broker
    window.addEventListener('storage', function(e) {
        if (e.key === 'staircaseCart') {
            cartItems = JSON.parse(e.newValue || '[]');
            updateCartBadgeCount();
        }
    });

    // ---------- KEYBOARD SHORTCUTS ----------
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            const primaryCartBtn = document.querySelector('.cart-btn');
            if (primaryCartBtn) primaryCartBtn.click();
        }
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeQuickView();
        }
    });

    // ---------- INITIALIZATION ----------
    function init() {
        loadTheme();
        cartItems = JSON.parse(localStorage.getItem('staircaseCart') || '[]');
        updateCartBadgeCount();
        
        const items = document.querySelectorAll('.item');
        items.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
            item.style.opacity = '0';
        });
        
        console.log('✨ Marble Page - Golden Edition initialized');
        console.log('📋 Shortcuts: Alt+T (theme), Alt+C (cart)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();