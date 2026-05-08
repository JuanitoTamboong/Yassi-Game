(function () {
    var overlay = document.getElementById('welcomeOverlay');
    var btn = document.getElementById('welcomeDismiss');
    
    if (!overlay) return;

    function hide() {
        overlay.classList.add('is-hidden');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Small delay before hiding completely for smooth transition
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    // Auto-hide after 5 seconds
    setTimeout(hide, 5000);

    if (btn) {
        btn.addEventListener('click', hide);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            hide();
        });
    }

    // Prevent body scroll while welcome is active
    document.body.style.overflow = 'hidden';
    
    function restoreScroll() {
        document.body.style.overflow = '';
    }
    
    overlay.addEventListener('animationend', function handler() {
        if (overlay.classList.contains('is-hidden')) {
            restoreScroll();
            overlay.removeEventListener('animationend', handler);
        }
    });
})();