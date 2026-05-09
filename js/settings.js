(function () {
    function $(id) {
        return document.getElementById(id);
    }

    var modal = $('settingsModal');
    var openBtn = $('settingsOpen');
    var closeBtn = $('settingsClose');

    // Audio in index.html
    var welcomeAudio = document.getElementById('welcomeAudio');
    var backgroundAudio = document.getElementById('backgroundAudio');


    var KEY_MUSIC_ENABLED = 'yassi_music_enabled';
    var KEY_SOUND_ENABLED = 'yassi_sound_enabled';

    function getBool(key, defaultValue) {
        try {
            var raw = localStorage.getItem(key);
            if (raw === null || raw === undefined) return defaultValue;
            return raw === 'true';
        } catch (e) {
            return defaultValue;
        }
    }

    function setBool(key, value) {
        try {
            localStorage.setItem(key, value ? 'true' : 'false');
        } catch (e) {
            // ignore
        }
    }

    function applyMusicSetting() {
        // Default to ON for first visit so bg music starts during welcome.
        var musicEnabled = getBool(KEY_MUSIC_ENABLED, true);
        if (!backgroundAudio) return;

        // Always reflect current toggle state.
        backgroundAudio.muted = !musicEnabled;

        if (musicEnabled) {
            backgroundAudio.volume = 1;
            // Try to start playback.
            try {
                if (backgroundAudio.currentTime > 0) backgroundAudio.currentTime = 0;
                var p0 = backgroundAudio.play();
                if (p0 && typeof p0.catch === 'function') p0.catch(function () {});
            } catch (e) {}
        }



        // Background music toggle should control the bg track only.
        backgroundAudio.muted = !musicEnabled;
        if (musicEnabled) {
            backgroundAudio.volume = 1;
            // Try to start playback; browsers may block without a gesture.
            try {
                if (backgroundAudio.currentTime > 0) backgroundAudio.currentTime = 0;
                var p = backgroundAudio.play();
                if (p && typeof p.catch === 'function') {
                    p.catch(function () {
                        // Autoplay restrictions: user just clicked, but keep silent fail.
                    });
                }
            } catch (e) {
                // ignore
            }
        }


        var musicToggle = $('musicToggle');
        if (musicToggle) {
            musicToggle.setAttribute('aria-pressed', musicEnabled ? 'true' : 'false');
            musicToggle.textContent = musicEnabled ? 'MUSIC: ON' : 'MUSIC: OFF';
        }
    }


    function applySoundSetting() {
        var soundEnabled = getBool(KEY_SOUND_ENABLED, true);

        // For now we only store it; future SFX can use it.
        var soundToggle = $('soundToggle');
        if (soundToggle) {
            soundToggle.setAttribute('aria-pressed', soundEnabled ? 'true' : 'false');
            soundToggle.textContent = soundEnabled ? 'SFX: ON' : 'SFX: OFF';
        }
    }

    function openModal() {
        if (!modal) return;
        document.body.style.overflow = 'hidden';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        var focusable = closeBtn || openBtn;
        if (focusable && typeof focusable.focus === 'function') focusable.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function bindToggles() {
        var musicToggle = $('musicToggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', function () {
                var current = getBool(KEY_MUSIC_ENABLED, true);
                var next = !current;
                setBool(KEY_MUSIC_ENABLED, next);
                applyMusicSetting();
            });
        }

        var soundToggle = $('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', function () {
                var current = getBool(KEY_SOUND_ENABLED, true);
                var next = !current;
                setBool(KEY_SOUND_ENABLED, next);
                applySoundSetting();
            });
        }
    }

    if (openBtn) {
        openBtn.addEventListener('click', function () {
            openModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            closeModal();
        });
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close on ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Initial state
    applyMusicSetting();
    applySoundSetting();
    bindToggles();
})();

