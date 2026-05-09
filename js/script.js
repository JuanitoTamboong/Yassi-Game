 (function () {
      var progressFill = document.getElementById('progressFill');
      var progressText = document.getElementById('progressText');

      var NAV_DELAY_MS = 1200; // short safety delay for smoother transition
      var MAX_WAIT_MS = 9000; // fallback so we never get stuck

      // Critical dashboard assets (match paths used in pages/yassi-dashboard.html)
      var imageUrls = [
        // background
        './assets/Yassi-Background.png',

        // welcome overlay (different variants exist in assets; preload the ones used by dashboard)
        "./assets/Welcome to Yassi's.png",
        "./assets/Welcome to Yassi's Game.png",

        // logos / character / skin
        "./assets/Yassi's Game.png",
        "./assets/Yassi Avatar.png",
        "./assets/avatar.png",

        // location icons
        "./assets/location/location.png",
        "./assets/location/Yassi's Home.png",
        "./assets/location/Kakai's Store.png",
        "./assets/location/Lola's House.png",
        "./assets/location/School.png",

        // bottom menu icons
        "./assets/buttom-menu/inventory.png",
        "./assets/buttom-menu/quests.png",
        "./assets/buttom-menu/values.png",
        "./assets/buttom-menu/cookbook.png",
        "./assets/buttom-menu/settings.png"
      ];

      // Audio is safe to preload; if browser blocks, we still redirect.
      var audioUrls = [
        "./audio/Welcome to Yassi's Game.mp3",
        "./audio/sound/bg-yassi-sound.mp3"
      ];





      function setProgress(done, total) {
        if (!progressFill || !progressText) return;
        var pct = total ? Math.round((done / total) * 100) : 0;
        progressFill.style.width = pct + '%';
        progressText.textContent = 'Loading assets... ' + done + '/' + total;
      }

      function preloadImage(url) {
        return new Promise(function (resolve) {
          var img = new Image();
          img.onload = function () { resolve(); };
          img.onerror = function () { resolve(); };
          img.src = url;
        });
      }

      function preloadAudio(url) {
        return new Promise(function (resolve) {
          try {
            var a = new Audio();
            var done = false;
            function finish() {
              if (done) return;
              done = true;
              resolve();
            }
            a.addEventListener('canplaythrough', finish, { once: true });
            a.addEventListener('error', finish, { once: true });
            a.preload = 'auto';
            a.src = url;

            // Fallback in case events don't fire
            setTimeout(finish, 2500);
          } catch (e) {
            resolve();
          }
        });
      }

      var all = [];

      // De-duplicate (in case there are accidental repeats)
      var seen = new Set();
      imageUrls.concat(audioUrls).forEach(function (u) {
        if (!u || typeof u !== 'string') return;
        if (seen.has(u)) return;
        seen.add(u);
      });

      all = imageUrls.map(preloadImage).concat(audioUrls.map(preloadAudio));

      var total = all.length;
      var doneCount = 0;
      setProgress(0, total);

      var start = Date.now();

      var perItem = all.map(function (p) {
        return p.then(function () {
          doneCount++;
          setProgress(doneCount, total);
        });
      });

      var redirect = function () {
        // Cache should make the next page faster.
        window.location.replace('./pages/yassi-dashboard.html');
      };

      Promise.allSettled(perItem).then(function () {
        var elapsed = Date.now() - start;
        var remaining = NAV_DELAY_MS - elapsed;
        if (remaining < 0) remaining = 0;
        setTimeout(redirect, remaining);
      });

      // Hard fallback
      setTimeout(function () {
        redirect();
      }, MAX_WAIT_MS);
    })();