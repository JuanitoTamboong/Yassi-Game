(function () {
  var avatarFill = document.getElementById('avatarFill');
  var progressFill = document.getElementById('progressFill');
  var progressText = document.getElementById('progressText');
  var progressPercent = document.getElementById('progressPercent');
  var loader = document.querySelector('.loader');
  var yassiAvatar = document.getElementById('yassiAvatar');

  var NAV_DELAY_MS = 1200;
  var MAX_WAIT_MS = 9000;

  var imageUrls = [
    './assets/Yassi-Background.png',
    "./assets/Welcome to Yassi's.png",
    "./assets/Welcome to Yassi's Game.png",
    "./assets/Yassi's Game.png",
    "./assets/Yassi Avatar.png",
    "./assets/avatar.png",
    "./assets/location/location.png",
    "./assets/location/Yassi's Home.png",
    "./assets/location/Kakai's Store.png",
    "./assets/location/Lola's House.png",
    "./assets/location/School.png",
    "./assets/buttom-menu/inventory.png",
    "./assets/buttom-menu/quests.png",
    "./assets/buttom-menu/values.png",
    "./assets/buttom-menu/cookbook.png",
    "./assets/buttom-menu/settings.png"
  ];

  var audioUrls = [
    "./audio/Welcome to Yassi's Game.mp3",
    "./audio/sound/bg-yassi-sound.mp3"
  ];

  var loadingMessages = [
    "Waking up Yassi",
    "Loading memories",
    "Preparing world",
    "Syncing friends",
    "Finalizing avatar",
    "Almost ready!",
    "Launching game..."
  ];

  function setProgress(done, total) {
    if (!progressFill || !progressText || !progressPercent || !avatarFill) return;
    
    var pct = total ? Math.round((done / total) * 100) : 0;
    
    // Update progress bar
    progressFill.style.width = pct + '%';
    progressPercent.textContent = pct + '%';
    
    // Update avatar fill (conic gradient rotates based on percentage)
    var rotation = (pct / 100) * 360;
    avatarFill.style.background = `
      conic-gradient(
        #7ed321 0deg,
        #37c8ff 90deg,
        #ffbc2f 180deg,
        #7ed321 270deg,
        transparent ${rotation}deg,
        transparent 360deg
      )
    `;
    
    // Update message
    var messageIndex = Math.min(Math.floor((done / total) * loadingMessages.length), loadingMessages.length - 1);
    progressText.textContent = loadingMessages[messageIndex];
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
        setTimeout(finish, 2500);
      } catch (e) {
        resolve();
      }
    });
  }

  // Preload Yassi avatar first for immediate visual feedback
  var avatarPreload = preloadImage('./assets/Yassi Avatar.png');
  yassiAvatar.onload = function() {
    yassiAvatar.style.opacity = '1';
  };

  var all = imageUrls.map(preloadImage).concat(audioUrls.map(preloadAudio));
  var total = all.length;
  var doneCount = 0;

  setProgress(0, total);

  var perItem = all.map(function (p) {
    return p.then(function () {
      doneCount++;
      setProgress(doneCount, total);
    });
  });

  var redirect = function () {
    loader.classList.add('loading-complete');
    setTimeout(function() {
      window.location.replace('./pages/yassi-dashboard.html');
    }, 800);
  };

  Promise.allSettled(perItem).then(function () {
    var elapsed = Date.now() - performance.now();
    var remaining = NAV_DELAY_MS - elapsed;
    if (remaining < 0) remaining = 0;
    setTimeout(redirect, remaining);
  });

  setTimeout(redirect, MAX_WAIT_MS);
})();