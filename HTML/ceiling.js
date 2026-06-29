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
    // Using the unified global cart variable name
    let cartItems = JSON.parse(localStorage.getItem('staircaseCart') || '[]');
    let currentProductId = null;

    // ---------- THEME SYSTEM ----------
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('ceilingTheme', newTheme);
        updateThemeUI(newTheme);
        showToast(`Switched to ${newTheme} theme`, 'success');
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('ceilingTheme') || 'dark';
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

    // ---------- CART CONTROLLERS ----------
    function addToCart(productId) {
        const item = document.querySelector(`.item[data-id="${productId}"]`);
        if (!item) return;
        
        const name = item.dataset.name;
        const price = parseInt(item.dataset.price);
        
        // Reload from storage to ensure we have any items added from other pages
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
        localStorage.setItem('staircaseCart', JSON.stringify(cartItems));
        updateCartBadgeCount();
    }

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

    // ---------- QUICK VIEW & NOTIFICATIONS ----------
    function openQuickView(productId) {
        const item = document.querySelector(`.item[data-id="${productId}"]`);
        if (!item) return;
        
        document.getElementById('modalImage').src = item.querySelector('img').src;
        document.getElementById('modalTitle').textContent = item.querySelector('h3').textContent;
        document.getElementById('modalDescription').textContent = item.querySelector('.description').textContent;
        document.getElementById('modalPrice').textContent = item.querySelector('.price').textContent;
        
        currentProductId = productId;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeQuickView() {
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = '';
        currentProductId = null;
    }

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

    // ---------- EVENT HANDLERS ----------
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (modalClose) modalClose.addEventListener('click', closeQuickView);

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(this.dataset.id);
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

    // Redirect handles
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    });

    window.addEventListener('storage', function(e) {
        if (e.key === 'staircaseCart') {
            cartItems = JSON.parse(e.newValue || '[]');
            updateCartBadgeCount();
        }
    });

    // ---------- INITIALIZATION ----------
    function init() {
        loadTheme();
        cartItems = JSON.parse(localStorage.getItem('staircaseCart') || '[]');
        updateCartBadgeCount();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();