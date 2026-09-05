(function(){

  /* ------------------------------------------------------------------
     0. curtain reveal
  ------------------------------------------------------------------- */
  var curtain = document.getElementById("curtain");
  setTimeout(function(){
    curtain.classList.add("open");
    setTimeout(function(){ curtain.remove(); }, 1000);
  }, 1800);

  /* ------------------------------------------------------------------
     0b. background music
  ------------------------------------------------------------------- */
  var bgMusic = document.getElementById("bgMusic");
  var muteBtn = document.getElementById("muteBtn");
  var savedMute = localStorage.getItem("galeryMuted");

  if (savedMute === "true"){
    bgMusic.muted = true;
    muteBtn.textContent = "\uD83D\uDD07";
  }

  var musicStarted = false;
  function tryPlayMusic(){
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.volume = 0.6;
    bgMusic.play().catch(function(err){ console.warn("Music play failed:", err); });
  }

  curtain.addEventListener("click", function(){ tryPlayMusic(); });
  document.addEventListener("click", function(){ tryPlayMusic(); }, { once: true });

  muteBtn.addEventListener("click", function(e){
    e.stopPropagation();
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    localStorage.setItem("galeryMuted", bgMusic.muted);
  });

  /* ------------------------------------------------------------------
     1. content data
  ------------------------------------------------------------------- */
  var photoCaptions = ["kita", "senyummu", "hari itu", "favoritku", "selalu", "kamu"];
  var rotations = [-6, 5, -3, 4, -4];

  var playlist = [
    { title: "Tough Luck", artist: "Laufey" },
    { title: "Castle in Hollywood", artist: "Laufey" },
    { title: "If You Want To", artist: "beabadoobee" },
    { title: "The Perfect Pair", artist: "beabadoobee" },
    { title: "ASAP", artist: "NewJeans" },
    { title: "Am I Bothering You", artist: "Reality Club" }
  ];

  /* ------------------------------------------------------------------
     2. render playlist
  ------------------------------------------------------------------- */
  var playlistEl = document.getElementById("playlist");

  playlist.forEach(function(song, i){
    var item = document.createElement("div");
    item.className = "music-card";
    item.innerHTML =
      '<span class="music-icon">♪</span>' +
      '<div>' +
        '<p class="music-title">' + song.title + '</p>' +
        '<p class="music-artist">' + song.artist + '</p>' +
      '</div>' +
      '<span class="music-num">' + (i + 1) + '</span>';
    playlistEl.appendChild(item);
  });

  /* ------------------------------------------------------------------
     3. render photo strip (horizontal scroll)
  ------------------------------------------------------------------- */
  var photoStrip = document.getElementById("photoStrip");
  var fileCounter = 0;

  photoCaptions.forEach(function(caption, i){
    var inputId = "photo-upload-" + (fileCounter++);
    var rot = rotations[i % rotations.length];
    var polaroid = document.createElement("div");
    polaroid.className = "polaroid";
    polaroid.style.transform = "rotate(" + rot + "deg)";
    polaroid.innerHTML =
      '<label class="polaroid-label" for="' + inputId + '">' +
        '<span class="tape"></span>' +
        '<div class="photo-inner">' +
          '<span class="hint-icon">♡</span>' +
          '<span class="hint-text">ketuk untuk<br>menambah foto</span>' +
        '</div>' +
        '<span class="photo-caption">' + caption + '</span>' +
        '<input type="file" id="' + inputId + '" accept="image/*">' +
      '</label>';
    photoStrip.appendChild(polaroid);
  });

  /* photo upload preview */
  photoStrip.addEventListener("change", function(e){
    if (e.target.type !== "file" || !e.target.files || !e.target.files[0]) return;
    var reader = new FileReader();
    var photoInner = e.target.closest(".polaroid").querySelector(".photo-inner");
    reader.onload = function(ev){
      photoInner.style.backgroundImage = "url(" + ev.target.result + ")";
      photoInner.classList.add("has-image");
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  /* final polaroid upload preview */
  var finalPolaroid = document.querySelector(".final-polaroid");
  if (finalPolaroid){
    finalPolaroid.addEventListener("change", function(e){
      if (e.target.type !== "file" || !e.target.files || !e.target.files[0]) return;
      var reader = new FileReader();
      var photoInner = finalPolaroid.querySelector(".photo-inner");
      reader.onload = function(ev){
        photoInner.style.backgroundImage = "url(" + ev.target.result + ")";
        photoInner.classList.add("has-image");
      };
      reader.readAsDataURL(e.target.files[0]);
    });
  }

  /* ------------------------------------------------------------------
     3b. bottom marquee (two infinite strips: right + left)
  ------------------------------------------------------------------- */
  var marqueeCaptions = [
    [ "kita", "senyummu", "hari itu", "favoritku", "selalu" ],
    [ "kamu", "rumahku", "rinduku", "cinta", "selalu" ]
  ];
  var marqueeRotations = [-5, 4, -3, 5, -4];

  function buildMarquee(stripEl, captions, seedOffset){
    captions.forEach(function(cap, i){
      var inputId = "marquee-" + stripEl.id + "-" + i + "-" + seedOffset;
      var rot = marqueeRotations[(i + seedOffset) % marqueeRotations.length];
      var polaroid = document.createElement("div");
      polaroid.className = "polaroid";
      polaroid.style.transform = "rotate(" + rot + "deg)";
      polaroid.innerHTML =
        '<label class="polaroid-label" for="' + inputId + '">' +
          '<span class="tape"></span>' +
          '<div class="photo-inner">' +
            '<span class="hint-icon">♡</span>' +
            '<span class="hint-text">ketuk untuk<br>menambah foto</span>' +
          '</div>' +
          '<span class="photo-caption">' + cap + '</span>' +
          '<input type="file" id="' + inputId + '" accept="image/*">' +
        '</label>';
      stripEl.appendChild(polaroid);
    });
  }

  var marqueeRight = document.getElementById("marqueeRight");
  var marqueeLeft = document.getElementById("marqueeLeft");

  if (marqueeRight){
    buildMarquee(marqueeRight, marqueeCaptions[0], 0);
    marqueeRight.innerHTML = marqueeRight.innerHTML + marqueeRight.innerHTML;
  }
  if (marqueeLeft){
    buildMarquee(marqueeLeft, marqueeCaptions[1], 3);
    marqueeLeft.innerHTML = marqueeLeft.innerHTML + marqueeLeft.innerHTML;
  }

  function initMarqueeScroll(stripEl, dir){
    var paused = false;
    stripEl.addEventListener("mouseenter", function(){ paused = true; });
    stripEl.addEventListener("mouseleave", function(){ paused = false; });
    stripEl.addEventListener("touchstart", function(){ paused = true; }, { passive: true });
    stripEl.addEventListener("touchend", function(){ setTimeout(function(){ paused = false; }, 1500); });
    function step(){
      if (!paused){
        if (dir === "right"){
          stripEl.scrollLeft -= 0.6;
          if (stripEl.scrollLeft <= 0){
            stripEl.scrollLeft += stripEl.scrollWidth / 2;
          }
        } else {
          stripEl.scrollLeft += 0.6;
          var half = stripEl.scrollWidth / 2;
          if (stripEl.scrollLeft >= half){
            stripEl.scrollLeft -= half;
          }
        }
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (marqueeRight) initMarqueeScroll(marqueeRight, "right");
  if (marqueeLeft) initMarqueeScroll(marqueeLeft, "left");

  document.querySelectorAll(".marquee-strip").forEach(function(strip){
    strip.addEventListener("change", function(e){
      if (e.target.type !== "file" || !e.target.files || !e.target.files[0]) return;
      var reader = new FileReader();
      var photoInner = e.target.closest(".polaroid").querySelector(".photo-inner");
      reader.onload = function(ev){
        photoInner.style.backgroundImage = "url(" + ev.target.result + ")";
        photoInner.classList.add("has-image");
      };
      reader.readAsDataURL(e.target.files[0]);
    });
  });

  /* ------------------------------------------------------------------
     4. scroll reveal (Intersection Observer, staggered)
  ------------------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(en, i){
      if (en.isIntersecting){
        var delay = (i % 4) * 90;
        setTimeout(function(){ en.target.classList.add("is-visible"); }, delay);
        revealObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

  document.querySelectorAll(".entry").forEach(function(el){ revealObserver.observe(el); });
  document.querySelectorAll(".music-card").forEach(function(el){ revealObserver.observe(el); });

  /* ------------------------------------------------------------------
      4c. bloom flowers open on scroll
  ------------------------------------------------------------------- */
  var bloomObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){
        en.target.classList.add("bloomed");
        setTimeout(function(){ burstBloom(en.target); }, 500);
        bloomObserver.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".bloom-flower").forEach(function(el){ bloomObserver.observe(el); });

  function burstBloom(flower){
    var glyphs = ["✿", "🌸", "✦", "❀", "✧"];
    for (var i = 0; i < 24; i++){
      var b = document.createElement("span");
      b.className = "bloom-burst";
      b.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      var angle = Math.random() * Math.PI * 2;
      var dist = 55 + Math.random() * 85;
      var spread = dist * 2.3;
      b.style.setProperty("--bx", (Math.cos(angle) * spread) + "px");
      b.style.setProperty("--by", (Math.sin(angle) * spread) + "px");
      b.style.setProperty("--br", (Math.random() * 160 - 80) + "deg");
      b.style.fontSize = (10 + Math.random() * 10) + "px";
      b.style.animationDelay = (Math.random() * 0.18) + "s";
      flower.appendChild(b);
      setTimeout(function(){ b.remove(); }, 1800);
    }
  }

  /* ------------------------------------------------------------------
     4b. envelope open / close
  ------------------------------------------------------------------- */
  var envelope = document.getElementById("envelope");
  var envelopeOpened = false;
  envelope.addEventListener("click", function(){
    envelopeOpened = !envelopeOpened;
    envelope.classList.toggle("open", envelopeOpened);
    if (envelopeOpened) burstHearts();
  });

  function burstHearts(){
    var glyphs = ["♡", "❤", "♥"];
    for (var i = 0; i < 80; i++){
      var bh = document.createElement("span");
      bh.className = "burst-heart";
      bh.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      var side = Math.random() < 0.5 ? 1 : -1;
      var deg = (35 + Math.random() * 40) * Math.PI / 180;
      var angle = side > 0 ? -deg : -(Math.PI - deg);
      var dist = 100 + Math.random() * 80;
      bh.style.setProperty("--hx", Math.cos(angle) * dist + "px");
      bh.style.setProperty("--hy", Math.sin(angle) * dist + "px");
      bh.style.setProperty("--hr", (Math.random() * 60 - 30) + "deg");
      bh.style.fontSize = (14 + Math.random() * 12) + "px";
      bh.style.animationDelay = (Math.random() * 0.15) + "s";
      envelope.appendChild(bh);
      setTimeout(function(){ bh.remove(); }, 1600);
    }
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     5. twinkling sparkles in background
  ------------------------------------------------------------------- */
  if (!reduceMotion){
    var sparkleField = document.getElementById("sparkle-field");
    var sparklePositions = [
      { left: "8%",   top: "28%" },
      { left: "90%",  top: "12%" },
      { left: "75%",  top: "42%" },
      { left: "12%",  top: "60%" },
      { left: "85%",  top: "70%" },
      { left: "20%",  top: "85%" },
      { left: "65%",  top: "88%" },
      { left: "5%",   top: "45%" },
      { left: "94%",  top: "35%" },
      { left: "40%",  top: "90%" }
    ];
    sparklePositions.forEach(function(pos, i){
      var s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = i % 3 === 0 ? "✦" : "✧";
      s.style.left = pos.left;
      s.style.top = pos.top;
      s.style.fontSize = (10 + Math.random() * 10) + "px";
      s.style.animationDelay = (Math.random() * 3) + "s";
      s.style.animationDuration = (2.4 + Math.random() * 2) + "s";
      sparkleField.appendChild(s);
    });
  }

  /* ------------------------------------------------------------------
     6. floating heart particles in background
  ------------------------------------------------------------------- */
  if (!reduceMotion){
    var field = document.getElementById("heart-field");
    var glyphs = ["♡", "❤", "♥"];
    function spawnHeart(){
      var h = document.createElement("span");
      h.className = "floating-heart";
      h.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      var size = 12 + Math.random() * 16;
      var duration = 8 + Math.random() * 7;
      var drift = (Math.random() * 140 - 70) + "px";
      var spin = (Math.random() * 60 - 30) + "deg";
      h.style.left = (Math.random() * 100) + "vw";
      h.style.fontSize = size + "px";
      h.style.animationDuration = duration + "s";
      h.style.setProperty("--drift", drift);
      h.style.setProperty("--spin", spin);
      field.appendChild(h);
      setTimeout(function(){ h.remove(); }, duration * 1000 + 200);
    }
    setInterval(spawnHeart, 900);
    for (var i = 0; i < 4; i++){ setTimeout(spawnHeart, i * 300); }

    /* ------------------------------------------------------------------
      6b. falling petals in background
    ------------------------------------------------------------------- */
    var petalField = document.getElementById("petal-field");
    var petalGlyphs = ["🌸", "🌺", "🌼", "🌷", "❀", "✿"];
    function spawnPetal(){
      var p = document.createElement("span");
      p.className = "petal";
      p.textContent = petalGlyphs[Math.floor(Math.random() * petalGlyphs.length)];
      var size = 14 + Math.random() * 15;
      var duration = 10 + Math.random() * 7;
      var sway = (Math.random() * 170 - 85) + "px";
      var rot = (Math.random() * 360 - 180) + "deg";
      p.style.left = (Math.random() * 100) + "vw";
      p.style.fontSize = size + "px";
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = (Math.random() * 2) + "s";
      p.style.setProperty("--sway", sway);
      p.style.setProperty("--pr", rot);
      petalField.appendChild(p);
      setTimeout(function(){ p.remove(); }, (duration + 3) * 1000);
    }
    setInterval(spawnPetal, 700);
    for (var i = 0; i < 5; i++){ setTimeout(spawnPetal, i * 450); }
  }

  /* ------------------------------------------------------------------
     7. cursor heart trail
  ------------------------------------------------------------------- */
  if (!reduceMotion){
    var trailField = document.getElementById("heart-trail");
    var trailGlyphs = ["♡", "♥", "❤"];
    var lastTrail = 0;
    document.addEventListener("mousemove", function(e){
      var now = Date.now();
      if (now - lastTrail < 80) return;
      lastTrail = now;
      var h = document.createElement("span");
      h.className = "trail-heart";
      h.textContent = trailGlyphs[Math.floor(Math.random() * trailGlyphs.length)];
      h.style.left = e.clientX + "px";
      h.style.top = e.clientY + "px";
      h.style.setProperty("--trail-spin", (Math.random() * 40 - 20) + "deg");
      trailField.appendChild(h);
      setTimeout(function(){ h.remove(); }, 900);
    });
  }

})();
