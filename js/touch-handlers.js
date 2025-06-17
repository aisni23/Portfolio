// Touch interaction handling
document.addEventListener('DOMContentLoaded', function() {
    // Detect touch device
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }

    // Better touch feedback for buttons
    const buttons = document.querySelectorAll('.filter-btn, .btn, .project-card');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.classList.add('touch-active');
        }, { passive: true });

        button.addEventListener('touchend', function(e) {
            this.classList.remove('touch-active');
        }, { passive: true });
    });

    // Prevent double-tap zoom on touch devices
    const touchElements = document.querySelectorAll('button, a, .project-card');
    touchElements.forEach(el => {
        el.addEventListener('touchend', function(e) {
            e.preventDefault();
            const click = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            this.dispatchEvent(click);
        }, { passive: false });
    });

    // Add smooth scrolling with touch momentum
    const scrollElements = document.querySelectorAll('.projects-grid, .nav-links');
    scrollElements.forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
    });

    // Handle navigation menu on touch devices
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.setAttribute('aria-expanded', 
                this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
