// ============================================
// LAVISH PAGE - GOLDEN EDITION
// Complete JavaScript Functionality
// ============================================

(function() {
    "use strict";

    // ---------- DOM REFERENCES ----------
    const form = document.getElementById('lavishForm');
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddr');
    const passwordInput = document.getElementById('pwd');
    const confirmBtn = document.getElementById('confirmBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    // ---------- STATE ----------
    let isSubmitting = false;

    // ---------- UTILITY FUNCTIONS ----------

    // Display welcome message with animation
    function setWelcome(message, type = 'info') {
        welcomeMessage.className = 'welcome-box';
        
        // Remove existing icons
        const existingIcons = welcomeMessage.querySelectorAll('i');
        existingIcons.forEach(icon => icon.remove());

        // Add appropriate icon
        const icon = document.createElement('i');
        if (type === 'success') {
            icon.className = 'fas fa-crown';
            welcomeMessage.classList.add('welcome-success');
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-triangle';
            welcomeMessage.classList.add('welcome-error');
        } else {
            icon.className = 'fas fa-sparkles';
        }
        welcomeMessage.prepend(icon);

        // Update message
        const textNode = document.createTextNode(' ' + message + ' ');
        welcomeMessage.appendChild(textNode);

        // Add closing icon for symmetry
        const closeIcon = document.createElement('i');
        closeIcon.className = icon.className;
        welcomeMessage.appendChild(closeIcon);

        // Trigger animation
        welcomeMessage.style.animation = 'none';
        requestAnimationFrame(() => {
            welcomeMessage.style.animation = 'fadeInUp 0.6s ease forwards';
        });
    }

    // Reset welcome to default
    function resetWelcome() {
        welcomeMessage.className = 'welcome-box';
        welcomeMessage.innerHTML = `
            <i class="fas fa-sparkles"></i>
            HEY BUDDY! WELCOME TO THE LAVISH WORLD
            <i class="fas fa-sparkles"></i>
        `;
        welcomeMessage.style.animation = 'fadeInUp 0.4s ease forwards';
    }

    // Show field error state
    function setFieldError(input, hasError) {
        if (hasError) {
            input.classList.add('error');
            input.classList.remove('success');
        } else {
            input.classList.remove('error');
            input.classList.add('success');
        }
    }

    // Reset all field states
    function resetFieldStates() {
        [nameInput, emailInput, passwordInput].forEach(input => {
            input.classList.remove('error', 'success');
        });
    }

    // ---------- VALIDATION FUNCTIONS ----------

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function getPasswordStrength(password) {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score; // 0-5
    }

    function getStrengthLabel(score) {
        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['#c0392b', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60'];
        return { label: labels[score], color: colors[score] };
    }

    // ---------- PASSWORD STRENGTH ----------

    function updatePasswordStrength(password) {
        if (!password || password.length === 0) {
            strengthBar.style.width = '0%';
            strengthBar.style.background = 'transparent';
            strengthText.textContent = 'Password strength: ';
            return;
        }

        const score = getPasswordStrength(password);
        const { label, color } = getStrengthLabel(score);
        const percentage = (score / 5) * 100;
        
        strengthBar.style.width = percentage + '%';
        strengthBar.style.background = color;
        strengthText.textContent = `Password strength: ${label}`;
        strengthText.style.color = color;
    }

    // ---------- PASSWORD TOGGLE ----------

    function togglePasswordVisibility() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        togglePasswordBtn.innerHTML = isPassword ? 
            '<i class="fas fa-eye-slash"></i>' : 
            '<i class="fas fa-eye"></i>';
    }

    // ---------- FORM SUBMISSION ----------

    function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;
        confirmBtn.classList.add('loading');
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Reset previous states
        resetFieldStates();

        // Get values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // ---------- VALIDATION ----------

        // Check empty fields
        if (!name || !email || !password) {
            setWelcome('Please fill in all fields, dear lavish one.', 'error');
            if (!name) setFieldError(nameInput, true);
            if (!email) setFieldError(emailInput, true);
            if (!password) setFieldError(passwordInput, true);
            resetButton();
            return;
        }

        // Validate email
        if (!validateEmail(email)) {
            setWelcome('Please enter a valid email address.', 'error');
            setFieldError(emailInput, true);
            emailInput.focus();
            resetButton();
            return;
        }

        // Validate password
        if (!validatePassword(password)) {
            setWelcome('Password must be at least 6 characters long.', 'error');
            setFieldError(passwordInput, true);
            passwordInput.focus();
            resetButton();
            return;
        }

        // ---------- SUCCESS ----------

        // Format name
        const formattedName = name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        // Show success message
        setWelcome(`WELCOME, ${formattedName}! YOUR LAVISH JOURNEY BEGINS.`, 'success');

        // Update button
        confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Success!';
        confirmBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        confirmBtn.style.color = '#0d0b0a';

        // Log to console
        console.log('✨ Lavish login successful:');
        console.log(`   Name: ${formattedName}`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${'•'.repeat(password.length)}`);

        // Success animation on inputs
        [nameInput, emailInput, passwordInput].forEach(input => {
            setFieldError(input, false);
        });

        // Redirect after a 2-second experience delay
        setTimeout(() => {
            window.location.href = "Home.HTML"; 
        }, 2000);
    }

    // Reset button state
    function resetButton() {
        isSubmitting = false;
        confirmBtn.classList.remove('loading');
        confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm';
        confirmBtn.style.background = '';
        confirmBtn.style.color = '';
    }

    // ---------- EVENT LISTENERS ----------

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Password toggle
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Password strength - real-time
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
        
        // Reset error state while typing
        if (this.value.length >= 6) {
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            this.classList.remove('success');
        }
    });

    // Email real-time validation
    emailInput.addEventListener('input', function() {
        if (this.value && validateEmail(this.value)) {
            this.classList.remove('error');
            this.classList.add('success');
        } else if (this.value) {
            this.classList.remove('success');
            this.classList.add('error');
        } else {
            this.classList.remove('error', 'success');
        }
    });

    // Name real-time validation
    nameInput.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            this.classList.remove('error');
            this.classList.add('success');
        } else {
            this.classList.remove('success');
        }
    });

    // Reset welcome when user starts typing in name
    nameInput.addEventListener('focus', function() {
        if (!welcomeMessage.classList.contains('welcome-success') && 
            !welcomeMessage.classList.contains('welcome-error')) {
            resetWelcome();
        }
    });

    // ---------- KEYBOARD SHORTCUTS ----------

    document.addEventListener('keydown', function(event) {
        // ESC: Clear form and reset
        if (event.key === 'Escape') {
            form.reset();
            resetFieldStates();
            resetWelcome();
            strengthBar.style.width = '0%';
            strengthBar.style.background = 'transparent';
            strengthText.textContent = 'Password strength: ';
            nameInput.focus();
            resetButton();
            setWelcome('Form cleared. Start fresh!', 'info');
        }

        // Ctrl+Enter: Submit form
        if (event.ctrlKey && event.key === 'Enter') {
            form.dispatchEvent(new Event('submit'));
        }
    });

    // ---------- AUTO-FOCUS ----------

    nameInput.focus();

    // ---------- INITIALIZATION ----------

    console.log('✨ Lavish Golden Edition loaded successfully!');
    console.log('📋 Shortcuts: ESC to clear, Ctrl+Enter to submit');
    console.log('👑 Welcome to elegance.');

    // Add a subtle golden shimmer to the container on load if element exists
    const container = document.querySelector('.container');
    if (container) {
        container.classList.add('shimmer');
        setTimeout(() => {
            container.classList.remove('shimmer');
        }, 3000);
    }

})();