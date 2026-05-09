(function () {
    var overlay = document.getElementById('welcomeOverlay');
    var btn = document.getElementById('welcomeDismiss');
    var audio = document.getElementById('welcomeAudio');

    if (!overlay) return;

    function stopAudio() {
        if (!audio) return;
        try {
            audio.pause();
            audio.currentTime = 0;
        } catch (e) {
            // ignore
        }
    }

    function tryPlayAudio() {
        if (!audio) return;
        audio.muted = false;
        audio.volume = 1;
        // rewind so replay works reliably
        if (audio.currentTime > 0) audio.currentTime = 0;

        try {
            var p = audio.play();
            if (p && typeof p.catch === 'function') {
                p.catch(function () {
                    // Autoplay blocked; will attempt again on user gesture.
                });
            }
        } catch (e) {
            // ignore
        }
    }

    // Start audio when the welcome overlay appears.
    // NOTE: many browsers require a user gesture; we also bind a first-tap attempt below.
    tryPlayAudio();

    function hide() {
        overlay.classList.add('is-hidden');
        overlay.setAttribute('aria-hidden', 'true');

        // Stop welcome audio immediately on dismiss/auto-hide.
        stopAudio();

        // If background music is enabled in settings, start it now (after welcome appears).
        // This ensures bg music is heard when the welcome overlay is shown.
        var backgroundAudio = document.getElementById('backgroundAudio');
        try {
            if (backgroundAudio) {
                var enabled = true;
                try {
                    var raw = localStorage.getItem('yassi_music_enabled');
                    if (raw === null || raw === undefined) enabled = true;
                    else enabled = raw === 'true';
                } catch (e) {
                    enabled = true;
                }

                backgroundAudio.muted = !enabled;
                if (enabled) {
                    backgroundAudio.volume = 1;
                    if (backgroundAudio.currentTime > 0) backgroundAudio.currentTime = 0;
                    var p = backgroundAudio.play();
                    if (p && typeof p.catch === 'function') {
                        p.catch(function () {});
                    }
                }
            }
        } catch (e) {
            // ignore
        }


        // Small delay before hiding completely for smooth transition
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    // Auto-hide after 5 seconds
    setTimeout(hide, 5000);

    if (btn) {
        btn.addEventListener('click', () => {
            // Ensure audio is not blocked if click happens quickly.
            // (No need to play again after hide() stops it.)
            stopAudio();
            hide();
        });

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // Start first (in case autoplay was blocked), then hide().
            // hide() will stop audio.
            tryPlayAudio();
            hide();
        });

        // Any first user pointer gesture should satisfy autoplay restrictions.
        btn.addEventListener('pointerdown', function () {
            tryPlayAudio();
        }, { once: true });
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

