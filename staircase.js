// ============================================
// STAIRCASE PAGE - GOLDEN EDITION
// Light & Dark Theme Toggle
// ============================================

(function() {
    "use strict";

    // ---------- DOM REFERENCES ----------
    const themeToggle = document.getElementById('themeToggle');
    const cartCount = document.getElementById('cartCount');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('quickViewModal');
    const modalClose = document.querySelector('.modal-close');
    const modalAddToCart = document.getElementById('modalAddToCart');
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    // ---------- STATE ----------
    let cartItems = JSON.parse(localStorage.getItem('staircaseCart') || '[]');
    let currentProductId = null;

    // ---------- THEME TOGGLE ----------
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('staircaseTheme', newTheme);
        
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
        const savedTheme = localStorage.getItem('staircaseTheme') || 'dark';
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

    // ---------- CART MANAGEMENT ----------
    function addToCart(productId) {
        const item = document.querySelector(`.item[data-id="${productId}"]`);
        if (!item) return;
        
        const name = item.dataset.name;
        const price = parseInt(item.dataset.price);
        
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
        
        updateCart();
        
        const btn = item.querySelector('.add-to-cart');
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        }, 2000);
    }

    function updateCart() {
        localStorage.setItem('staircaseCart', JSON.stringify(cartItems));
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
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
        
        const img = item.querySelector('img').src;
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('.description').textContent;
        const price = item.querySelector('.price').textContent;
        const originalPrice = item.querySelector('.original-price').textContent;
        const rating = item.querySelector('.rating').innerHTML;
        const features = item.querySelector('.features').innerHTML;
        
        document.getElementById('modalImage').src = img;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalDescription').textContent = description;
        document.getElementById('modalPrice').textContent = price;
        document.getElementById('modalOriginalPrice').textContent = originalPrice;
        document.querySelector('.modal-rating').innerHTML = rating;
        document.querySelector('.modal-features').innerHTML = features;
        
        currentProductId = productId;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeQuickView() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        currentProductId = null;
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

    // ---------- EVENT LISTENERS ----------
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.id;
            addToCart(productId);
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
            const item = this.closest('.item');
            const productId = item.dataset.id;
            openQuickView(productId);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeQuickView);
    }

    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeQuickView();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeQuickView();
        }
    });

    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', function() {
            if (currentProductId) {
                addToCart(currentProductId);
                closeQuickView();
            }
        });
    }

    // Replace the old '.cart-btn' event listener with this:
const cartBtn = document.querySelector('.cart-btn');
if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Redirects the user to the dedicated cart page
        window.location.href = 'cart.html';
    });
}

    // ---------- KEYBOARD SHORTCUTS ----------
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            document.querySelector('.cart-btn').click();
        }
    });

    // ---------- INITIALIZATION ----------
    function init() {
        loadTheme();
        updateCart();
        
        const items = document.querySelectorAll('.item');
        items.forEach((item, index) => {
            item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
            item.style.opacity = '0';
        });
        
        console.log('✨ Staircase Page - Golden Edition initialized');
        console.log('📋 Shortcuts: Alt+T (theme), Alt+C (cart)');
        console.log('👑 Elevate your home with stunning staircases.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();