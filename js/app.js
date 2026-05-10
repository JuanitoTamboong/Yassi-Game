(function() {
    // ===== LANDSCAPE FORCE SYSTEM =====
    const rotateWarning = document.getElementById('rotateWarning');
    const gameContainer = document.getElementById('gameContainer');
    
    function checkOrientation() {
        // Check if rotateWarning element exists
        if (!rotateWarning) return;
        
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        
        if (isPortrait) {
            rotateWarning.classList.add('active');
            if (gameContainer) gameContainer.style.opacity = '0.3';
            document.body.style.overflow = 'hidden';
        } else {
            rotateWarning.classList.remove('active');
            if (gameContainer) gameContainer.style.opacity = '1';
            document.body.style.overflow = '';
        }
    }
    
    // Initial check
    checkOrientation();
    
    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', function() {
        setTimeout(checkOrientation, 50);
    });
    
    // Also check on load
    window.addEventListener('load', checkOrientation);

    // ===== WELCOME OVERLAY SYSTEM =====
    const overlay = document.getElementById('welcomeOverlay');
    const btn = document.getElementById('welcomeDismiss');
    const welcomeAudio = document.getElementById('welcomeAudio');
    const backgroundAudio = document.getElementById('backgroundAudio');

    // Exit if no overlay found
    if (!overlay) return;

    // Settings manager for audio preferences
    let musicEnabled = true;
    let sfxEnabled = true;

    function loadSettings() {
        try {
            const savedMusic = localStorage.getItem('yassi_music_enabled');
            if (savedMusic !== null) musicEnabled = savedMusic === 'true';
            const savedSfx = localStorage.getItem('yassi_sfx_enabled');
            if (savedSfx !== null) sfxEnabled = savedSfx === 'true';
        } catch(e) {
            console.log('Could not load settings:', e);
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem('yassi_music_enabled', musicEnabled);
            localStorage.setItem('yassi_sfx_enabled', sfxEnabled);
        } catch(e) {
            console.log('Could not save settings:', e);
        }
    }

    loadSettings();

    function updateMusicToggleUI() {
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.textContent = musicEnabled ? 'MUSIC: ON' : 'MUSIC: OFF';
            musicToggle.classList.toggle('is-on', musicEnabled);
            musicToggle.classList.toggle('is-off', !musicEnabled);
            musicToggle.setAttribute('aria-pressed', musicEnabled);
        }
    }

    function updateSfxToggleUI() {
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
            soundToggle.classList.toggle('is-on', sfxEnabled);
            soundToggle.classList.toggle('is-off', !sfxEnabled);
            soundToggle.setAttribute('aria-pressed', sfxEnabled);
        }
    }

    function stopWelcomeAudio() {
        if (!welcomeAudio) return;
        try {
            welcomeAudio.pause();
            welcomeAudio.currentTime = 0;
        } catch (e) {
            console.log('Could not stop welcome audio:', e);
        }
    }

    function tryPlayWelcomeAudio() {
        if (!welcomeAudio) return;
        welcomeAudio.muted = false;
        welcomeAudio.volume = 1;
        if (welcomeAudio.currentTime > 0) welcomeAudio.currentTime = 0;
        try {
            const p = welcomeAudio.play();
            if (p && typeof p.catch === 'function') {
                p.catch(function(err) {
                    console.log('Welcome audio play failed:', err);
                });
            }
        } catch (e) {
            console.log('Could not play welcome audio:', e);
        }
    }

    function playBackgroundMusic() {
        if (!backgroundAudio) return;
        backgroundAudio.muted = !musicEnabled;
        if (musicEnabled) {
            backgroundAudio.volume = 0.5;
            try {
                if (backgroundAudio.currentTime === 0 || backgroundAudio.paused) {
                    const p = backgroundAudio.play();
                    if (p && typeof p.catch === 'function') {
                        p.catch(function(err) {
                            console.log('Background music play failed:', err);
                        });
                    }
                }
            } catch (e) {
                console.log('Could not play background music:', e);
            }
        } else {
            try {
                backgroundAudio.pause();
            } catch(e) {
                console.log('Could not pause background music:', e);
            }
        }
    }

    function stopBackgroundMusic() {
        if (!backgroundAudio) return;
        try {
            backgroundAudio.pause();
            backgroundAudio.currentTime = 0;
        } catch(e) {
            console.log('Could not stop background music:', e);
        }
    }

    function hideWelcomeOverlay() {
        if (!overlay) return;
        overlay.classList.add('is-hidden');
        overlay.setAttribute('aria-hidden', 'true');
        stopWelcomeAudio();
        setTimeout(() => {
            if (overlay) overlay.style.display = 'none';
        }, 300);
    }

    function onUserDismiss() {
        tryPlayWelcomeAudio();
        hideWelcomeOverlay();
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 350);
    }

    // Auto-hide after 5 seconds
    const autoHideTimer = setTimeout(function() {
        if (overlay && !overlay.classList.contains('is-hidden')) {
            hideWelcomeOverlay();
        }
    }, 5000);

    if (btn) {
        btn.addEventListener('click', onUserDismiss);
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            onUserDismiss();
        }, { passive: false });
        
        btn.addEventListener('pointerdown', function() {
            tryPlayWelcomeAudio();
        }, { once: true });
    }

    // Initial scroll lock
    document.body.style.overflow = 'hidden';

    function restoreScroll() {
        document.body.style.overflow = '';
    }

    if (overlay) {
        overlay.addEventListener('animationend', function handler(e) {
            if (overlay.classList.contains('is-hidden')) {
                restoreScroll();
                overlay.removeEventListener('animationend', handler);
                clearTimeout(autoHideTimer);
            }
        });
    }

    // ===== SETTINGS MODAL =====
    const settingsModal = document.getElementById('settingsModal');
    const settingsOpen = document.getElementById('settingsOpen');
    const settingsClose = document.getElementById('settingsClose');
    const musicToggleBtn = document.getElementById('musicToggle');
    const soundToggleBtn = document.getElementById('soundToggle');

    function openSettings() {
        if (settingsModal) {
            settingsModal.classList.add('is-open');
            settingsModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeSettings() {
        if (settingsModal) {
            settingsModal.classList.remove('is-open');
            settingsModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (settingsOpen) {
        settingsOpen.addEventListener('click', openSettings);
        settingsOpen.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openSettings();
            }
        });
    }

    if (settingsClose) {
        settingsClose.addEventListener('click', closeSettings);
    }

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    if (musicToggleBtn) {
        musicToggleBtn.addEventListener('click', () => {
            musicEnabled = !musicEnabled;
            saveSettings();
            updateMusicToggleUI();
            if (musicEnabled) {
                playBackgroundMusic();
            } else {
                stopBackgroundMusic();
            }
        });
    }

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            sfxEnabled = !sfxEnabled;
            saveSettings();
            updateSfxToggleUI();
        });
    }

    updateMusicToggleUI();
    updateSfxToggleUI();

    // Start background music after first user interaction (browser autoplay policy)
    let musicStarted = false;
    function startMusicOnFirstInteraction() {
        if (!musicStarted && musicEnabled) {
            musicStarted = true;
            playBackgroundMusic();
        }
        document.removeEventListener('click', startMusicOnFirstInteraction);
        document.removeEventListener('touchstart', startMusicOnFirstInteraction);
        document.removeEventListener('keydown', startMusicOnFirstInteraction);
    }

    document.addEventListener('click', startMusicOnFirstInteraction);
    document.addEventListener('touchstart', startMusicOnFirstInteraction);
    document.addEventListener('keydown', startMusicOnFirstInteraction);

    // ===== ACTION BUTTON FEEDBACK =====
    const actionButtons = document.querySelectorAll('.circle-btn');
    
    function playBeepSound(frequency = 800, duration = 0.3, volume = 0.1) {
        if (!sfxEnabled) return;
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            oscillator.connect(gain);
            gain.connect(audioCtx.destination);
            oscillator.frequency.value = frequency;
            gain.gain.value = volume;
            oscillator.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            oscillator.stop(audioCtx.currentTime + duration);
            audioCtx.resume().catch(e => console.log('Audio context resume failed:', e));
        } catch(e) {
            console.log('Could not play beep:', e);
        }
    }
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            playBeepSound(800, 0.25, 0.08);
            
            // Visual feedback
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
            
            const actionName = btn.title || btn.querySelector('.btn-label')?.innerText || 'Action';
            console.log(`Action: ${actionName}`);
        });
    });

    // ===== PLUS BUTTON FEEDBACK =====
    const plusBtn = document.querySelector('.plus-btn');
    if (plusBtn) {
        plusBtn.addEventListener('click', function() {
            const coinAmount = document.querySelector('.coin-amount');
            if (coinAmount) {
                let current = parseInt(coinAmount.innerText) || 120;
                current += 10;
                coinAmount.innerText = current;
            }
            playBeepSound(1200, 0.2, 0.08);
        });
    }

    // ===== LOCATION ITEM CLICK =====
    const locationItems = document.querySelectorAll('.location-item');
    locationItems.forEach(item => {
        item.addEventListener('click', function() {
            locationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            playBeepSound(600, 0.15, 0.06);
            const locationName = this.querySelector('span')?.innerText || 'Unknown';
            console.log(`Location changed to: ${locationName}`);
        });
    });

    // ===== MENU ITEM CLICKS =====
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const menuText = this.querySelector('span')?.innerText;
            console.log(`Menu clicked: ${menuText}`);
            
            // Don't show alert for Settings - it opens the modal
            if (menuText !== 'SETTINGS' && menuText !== 'Settings') {
                playBeepSound(700, 0.2, 0.07);
                // Optional: Show a subtle toast instead of alert for better UX
                const toastMsg = `${menuText} feature coming soon! 🌟`;
                console.log(toastMsg);
                
                // Create temporary toast notification
                const toast = document.createElement('div');
                toast.textContent = toastMsg;
                toast.style.position = 'fixed';
                toast.style.bottom = '100px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.background = 'rgba(0,0,0,0.85)';
                toast.style.color = '#ffd44a';
                toast.style.padding = '10px 20px';
                toast.style.borderRadius = '30px';
                toast.style.fontWeight = '800';
                toast.style.fontSize = '14px';
                toast.style.zIndex = '10000';
                toast.style.backdropFilter = 'blur(10px)';
                toast.style.border = '1px solid #ffd44a';
                toast.style.whiteSpace = 'nowrap';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            }
        });
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        if (backgroundAudio) {
            backgroundAudio.pause();
        }
    });

    console.log('Yassi Dashboard initialized successfully!');
})();