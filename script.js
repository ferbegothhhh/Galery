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
  muteBtn.setAttribute("aria-pressed", bgMusic.muted ? "true" : "false");

  var musicStarted = false;
  function tryPlayMusic(){
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.volume = 0.6;
    bgMusic.play().catch(function(err){ console.warn("Music play failed:", err); });
  }

  curtain.addEventListener("click", function(){ tryPlayMusic(); });
  curtain.addEventListener("keydown", function(e){
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      tryPlayMusic();
    }
  });
  document.addEventListener("click", function(){ tryPlayMusic(); }, { once: true });

  muteBtn.addEventListener("click", function(e){
    e.stopPropagation();
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    muteBtn.setAttribute("aria-pressed", bgMusic.muted ? "true" : "false");
    localStorage.setItem("galeryMuted", bgMusic.muted);
  });

  /* ------------------------------------------------------------------
     0c. back to top button
  ------------------------------------------------------------------- */
  var backTopBtn = document.getElementById("backTopBtn");
  if (backTopBtn){
    function updateBackTop(){
      var show = window.scrollY > 600;
      backTopBtn.classList.toggle("show", show);
      backTopBtn.setAttribute("aria-hidden", show ? "false" : "true");
    }
    window.addEventListener("scroll", updateBackTop, { passive: true });
    updateBackTop();
    backTopBtn.addEventListener("click", function(){
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------
     1. content data
  ------------------------------------------------------------------- */
  var photoCaptions = ["kita", "senyummu", "hari itu", "favoritku", "selalu", "kamu"];
  var rotations = [-6, 5, -3, 4, -4];

  var photoStripPaths = [
    "photos/photo-stript/1.jpg",
    "photos/photo-stript/2.jpg",
    "photos/photo-stript/3.jpg",
    "photos/photo-stript/4.jpg",
    "photos/photo-stript/5.jpg",
    "photos/photo-stript/6.jpg"
  ];

  var playlist = [
    { title: "Tough Luck", artist: "Laufey", url: "https://open.spotify.com/track/1GexRDFzRQpNkflfXgI2lM", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02ef6809d9f73321fcd2e77b4b" },
    { title: "Castle in Hollywood", artist: "Laufey", url: "https://open.spotify.com/track/3zTnSPti5JjNsowJH4SS3u", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e028f68f6e65c1cfd36bb21561c" },
    { title: "If You Want To", artist: "beabadoobee", url: "https://open.spotify.com/track/7I1kle4TNmkfednJDKo8GR", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02fe11583497b2a332995b88ed" },
    { title: "The Perfect Pair", artist: "beabadoobee", url: "https://open.spotify.com/track/41P6Tnd8KIHqON0QIydx6a", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02384d10f967c2b914de7e2713" },
    { title: "ASAP", artist: "NewJeans", url: "https://open.spotify.com/track/5fpyAakgFOm4YTXkgfPzvV", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020744690248ef3ba7b776ea7b" },
    { title: "Am I Bothering You", artist: "Reality Club", url: "https://open.spotify.com/track/4XEJR0jb29elGda86cL0IK", cover: "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02c607bcd8355681ab4fac2968" }
  ];

  /* ------------------------------------------------------------------
     2. render playlist
  ------------------------------------------------------------------- */
  var playlistEl = document.getElementById("playlist");

  playlist.forEach(function(song, i){
    var item = document.createElement("a");
    item.className = "music-card";
    item.href = song.url;
    item.target = "_blank";
    item.rel = "noopener";
    item.setAttribute("aria-label", "Putar " + song.title + " di Spotify");
    item.innerHTML =
      '<span class="music-cover"><img src="' + song.cover + '" alt="' + song.title + '"></span>' +
      '<div>' +
        '<p class="music-title">' + song.title + '</p>' +
        '<p class="music-artist">' + song.artist + '</p>' +
      '</div>' +
      '<span class="music-num">' + (i + 1) + '</span>';
    playlistEl.appendChild(item);
  });

  /* ------------------------------------------------------------------
     2b. memory quotes slider
  ------------------------------------------------------------------- */
  var quotes = [
    "setiap lagu yang kita dengar, selalu ingatkanku padamu.",
    "kamu adalah kebetulan terindah yang pernah kusyukuri.",
    "dari semua tempat di dunia, kamu yang paling kucari.",
    "senyummu cukup untuk membuat hariku jadi lebih baik.",
    "kalau waktu bisa kuputar, aku masih akan memilih bertemu kamu.",
    "rumahku bukan tempat, tapi kamu.",
    "setiap detik bersamamu terasa seperti lengkingan lagu favoritku.",
    "kamu, di mana-mana ada kamu."
  ];
  var quoteEl = document.getElementById("memoryQuote");
  var quoteDots = document.getElementById("quoteDots");
  var quoteIndex = 0;
  var quoteTimer = null;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (quoteEl && quotes.length){
    quotes.forEach(function(_, i){
      var dot = document.createElement("button");
      dot.className = "quote-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Kenangan ke-" + (i + 1));
      dot.addEventListener("click", function(){ showQuote(i); restartQuoteTimer(); });
      quoteDots.appendChild(dot);
    });

    function showQuote(i){
      var dotEls = quoteDots.querySelectorAll(".quote-dot");
      if (!reduceMotion) quoteEl.classList.remove("quote-anim");
      void quoteEl.offsetWidth;
      quoteIndex = i;
      quoteEl.textContent = quotes[i];
      dotEls.forEach(function(d, j){
        d.classList.toggle("active", j === i);
      });
      if (!reduceMotion) quoteEl.classList.add("quote-anim");
    }

    function restartQuoteTimer(){
      if (quoteTimer) clearInterval(quoteTimer);
      quoteTimer = setInterval(function(){ showQuote((quoteIndex + 1) % quotes.length); }, 4500);
    }

    showQuote(0);
    restartQuoteTimer();
  }

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
    if (photoStripPaths[i]){
      var photoInner = polaroid.querySelector(".photo-inner");
      photoInner.style.backgroundImage = "url(\"" + photoStripPaths[i] + "\")";
      photoInner.classList.add("has-image");
    }
    photoStrip.appendChild(polaroid);
  });

  /* photo upload preview */
  photoStrip.addEventListener("change", function(e){
    if (e.target.type !== "file" || !e.target.files || !e.target.files[0]) return;
    var reader = new FileReader();
    var photoInner = e.target.closest(".polaroid").querySelector(".photo-inner");
    reader.onload = function(ev){
      photoInner.style.backgroundImage = "url(\"" + ev.target.result + "\")";
      photoInner.classList.add("has-image");
    };
    reader.readAsDataURL(e.target.files[0]);
  });

  /* ------------------------------------------------------------------
     3a. "Art by me" photo grid (12 slots, pre-filled)
  ------------------------------------------------------------------- */
  var letterPhotoStrip = document.getElementById("letterPhotoStrip");

  var letterPhotoPaths = [
    "photos/Art%20by%20me/Tak_berjudul98_1.png",
    "photos/Art%20by%20me/IMG_20251017_174207_622.jpg",
    "photos/Art%20by%20me/Tak_berjudul89_1.png",
    "photos/Art%20by%20me/IMG_20260905_133345_001.jpg",
    "photos/Art%20by%20me/Tak_berjudul78_1.png",
    "photos/Art%20by%20me/quality_restoration_20260905134242979.jpg",
    "photos/Art%20by%20me/Tak_berjudul55_2.png",
    "photos/Art%20by%20me/Untitled111_1.png",
    "photos/Art%20by%20me/Tak_berjudul19_2.png",
    "photos/Art%20by%20me/Untitled106.png",
    "photos/Art%20by%20me/Tak_berjudul97_1.png",
    "photos/Art%20by%20me/IMG_20260905_133520_701.jpg",
    "photos/Art%20by%20me/IMG_20260905_133424_671.jpg",
    "photos/Art%20by%20me/quality_restoration_20260905134030512.jpg",
    "photos/Art%20by%20me/Tak_berjudul32_3.png",
    "photos/Art%20by%20me/Tak_berjudul37_1.png",
    "photos/Art%20by%20me/Tak_berjudul38.png",
    "photos/Art%20by%20me/Tak_berjudul52_2.png",
    "photos/Art%20by%20me/Tak_berjudul56_1.png",
    "photos/Art%20by%20me/Tak_berjudul85_3.png",
    "photos/Art%20by%20me/Untitled116.png",
    "photos/Art%20by%20me/Untitled130_1.png",
    "photos/Art%20by%20me/Untitled133_2.png",
    "photos/Art%20by%20me/Untitled137_1.png"
  ];

  if (letterPhotoStrip){
    for (var l = 0; l < 24; l++){
      var inputId = "letter-photo-" + l;
      var polaroid = document.createElement("div");
      polaroid.className = "polaroid";
      polaroid.style.transform = "rotate(" + rotations[l % rotations.length] + "deg)";
      polaroid.innerHTML =
        '<label class="polaroid-label" for="' + inputId + '">' +
          '<span class="tape"></span>' +
          '<div class="photo-inner">' +
            '<span class="hint-icon">♡</span>' +
            '<span class="hint-text">ketuk untuk<br>menambah foto</span>' +
          '</div>' +
          '<input type="file" id="' + inputId + '" accept="image/*">' +
        '</label>';
      if (letterPhotoPaths[l]){
        var photoInner = polaroid.querySelector(".photo-inner");
        photoInner.style.backgroundImage = "url(\"" + letterPhotoPaths[l] + "\")";
        photoInner.classList.add("has-image");
      }
      letterPhotoStrip.appendChild(polaroid);
    }

    letterPhotoStrip.addEventListener("change", function(e){
      if (e.target.type !== "file" || !e.target.files || !e.target.files[0]) return;
      var reader = new FileReader();
      var photoInner = e.target.closest(".polaroid").querySelector(".photo-inner");
      reader.onload = function(ev){
        photoInner.style.backgroundImage = "url(\"" + ev.target.result + "\")";
        photoInner.classList.add("has-image");
      };
      reader.readAsDataURL(e.target.files[0]);
    });
  }

  /* final polaroid flip card — 2 sisi, upload per sisi */
  var finalPolaroid = document.getElementById("finalPolaroid");

  var closingPhotoPaths = [
    "photos/closing-palaloid/1.png",
    "photos/closing-palaloid/2.jpg"
  ];

  if (finalPolaroid){
    var frontInner = finalPolaroid.querySelector(".final-front .photo-inner");
    if (frontInner && closingPhotoPaths[0]){
      frontInner.style.backgroundImage = "url(\"" + closingPhotoPaths[0] + "\")";
      frontInner.classList.add("has-image");
    }
    var backInner = finalPolaroid.querySelector(".final-back .photo-inner");
    if (backInner && closingPhotoPaths[1]){
      backInner.style.backgroundImage = "url(\"" + closingPhotoPaths[1] + "\")";
      backInner.classList.add("has-image");
    }

    var finalFlipBusy = false;
    function openFinalPicker(face){
      var input = face.querySelector('input[type="file"]');
      if (input) input.click();
    }
    function toggleFinalFlip(){
      if (finalFlipBusy) return;
      finalFlipBusy = true;
      var flipped = finalPolaroid.classList.toggle("flipped");
      var visibleFace = flipped ?
        finalPolaroid.querySelector(".final-back") :
        finalPolaroid.querySelector(".final-front");
      setTimeout(function(){
        openFinalPicker(visibleFace);
        finalFlipBusy = false;
      }, 800);
    }
    finalPolaroid.addEventListener("click", function(e){
      e.preventDefault();
      toggleFinalFlip();
    });
    finalPolaroid.addEventListener("keydown", function(e){
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        toggleFinalFlip();
      }
    });
    finalPolaroid.addEventListener("change", function(e){
      if (e.target.type !== "file" || !e.target.files || !e.target.files[0]) return;
      var reader = new FileReader();
      var photoInner = e.target.closest(".final-face").querySelector(".photo-inner");
      reader.onload = function(ev){
        photoInner.style.backgroundImage = "url(\"" + ev.target.result + "\")";
        photoInner.classList.add("has-image");
      };
      reader.readAsDataURL(e.target.files[0]);
    });
  }

  /* ------------------------------------------------------------------
     3b. bottom marquee (two infinite strips: right + left)
  ------------------------------------------------------------------- */
  var marqueeCaptions = [
    [ "kita", "senyummu", "hari itu", "favoritku", "selalu", "pelukmu", "tawamu", "rumahku" ],
    [ "kamu", "rumahku", "rinduku", "cinta", "selalu", "genggaman", "nada", "senja" ]
  ];
  var marqueeRotations = [-5, 4, -3, 5, -4, 3, -4, 5];

  var marqueePhotoPaths = [
    "photos/marque/1.jpg",
    "photos/marque/2.jpg",
    "photos/marque/3.jpg",
    "photos/marque/4.jpg",
    "photos/marque/5.jpg",
    "photos/marque/6.jpg",
    "photos/marque/7.jpg",
    "photos/marque/8.jpg",
    "photos/marque/9.jpg",
    "photos/marque/10.jpg",
    "photos/marque/11.jpg",
    "photos/marque/12.jpg",
    "photos/marque/13.jpg",
    "photos/marque/14.jpg",
    "photos/marque/15.jpg",
    "photos/marque/16.jpg"
  ];

  function buildMarquee(stripEl, captions, seedOffset, photoArr){
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
      if (photoArr && photoArr[i]){
        var photoInner = polaroid.querySelector(".photo-inner");
        photoInner.style.backgroundImage = "url(\"" + photoArr[i] + "\")";
        photoInner.classList.add("has-image");
      }
      stripEl.appendChild(polaroid);
    });
  }

  var marqueeRight = document.getElementById("marqueeRight");
  var marqueeLeft = document.getElementById("marqueeLeft");

  if (marqueeRight){
    buildMarquee(marqueeRight, marqueeCaptions[0], 0, marqueePhotoPaths.slice(0, 8));
    marqueeRight.innerHTML = marqueeRight.innerHTML + marqueeRight.innerHTML;
  }
  if (marqueeLeft){
    buildMarquee(marqueeLeft, marqueeCaptions[1], 3, marqueePhotoPaths.slice(8, 16));
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
        photoInner.style.backgroundImage = "url(\"" + ev.target.result + "\")";
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
  function toggleEnvelope(){
    envelopeOpened = !envelopeOpened;
    envelope.classList.toggle("open", envelopeOpened);
    if (envelopeOpened) burstHearts();
  }
  envelope.addEventListener("click", toggleEnvelope);
  envelope.addEventListener("keydown", function(e){
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      toggleEnvelope();
    }
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

/* ============================================================
   TAMBAHAN HIASAN — kupu-kupu, sparkle (gaya ES5)
   ============================================================ */

(function () {

  var BUTTERFLY_SPOTS = [
    { top: "20%", left: "24%" },
    { top: "58%", left: "76%" },
    { top: "72%", left: "18%" }
  ];

  var SPARKLE_SPOTS = [
    { top: "14%", left: "30%" },
    { top: "34%", left: "70%" },
    { top: "62%", left: "26%" },
    { top: "70%", left: "82%" },
    { top: "46%", left: "12%" },
    { top: "24%", left: "88%" },
    { top: "80%", left: "60%" },
    { top: "10%", left: "60%" }
  ];

  var butterflySVG =
    '<svg viewBox="0 0 24 22">' +
      '<g class="wing wing-left"><path d="M12 11 C6 2, 0 4, 2 12 C4 18, 10 16, 12 11 Z" fill="#e8879f"/></g>' +
      '<g class="wing wing-right"><path d="M12 11 C18 2, 24 4, 22 12 C20 18, 14 16, 12 11 Z" fill="#f0a6bc"/></g>' +
      '<rect x="11" y="6" width="2" height="12" rx="1" fill="#7d6367"/>' +
    '</svg>';

  function addDecoLayer(container) {
    var layer = document.createElement("div");
    layer.className = "deco-layer";
    layer.setAttribute("aria-hidden", "true");
    container.appendChild(layer);
    return layer;
  }

  function spawnButterflies(layer) {
    for (var i = 0; i < BUTTERFLY_SPOTS.length; i++) {
      var spot = BUTTERFLY_SPOTS[i];
      var el = document.createElement("div");
      el.className = "deco-butterfly";
      el.style.top = spot.top;
      el.style.left = spot.left;
      el.style.animationDuration = (5 + i) + "s, " + (12 + i * 2) + "s";
      el.innerHTML = butterflySVG;
      layer.appendChild(el);
    }
  }

  function spawnSparkles(layer) {
    for (var i = 0; i < SPARKLE_SPOTS.length; i++) {
      var spot = SPARKLE_SPOTS[i];
      var el = document.createElement("div");
      el.className = "deco-sparkle";
      el.style.top = spot.top;
      el.style.left = spot.left;
      el.style.animationDelay = (i * 0.4) + "s";
      layer.appendChild(el);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var hero = document.querySelector(".hero");
    if (!hero) return;

    var layer = addDecoLayer(hero);
    spawnButterflies(layer);
    spawnSparkles(layer);
  });

})();

/* ============================================================
   TAMBAHAN HIASAN #2 — garland, batang bunga, vine, zona petal/heart
   ============================================================ */

(function () {

  var FLAG_COLORS = ["#f0a6bc", "#fbeff1", "#d8b48c", "#cf8a97"];
  var FLAG_COUNT = 9;

  var flowerStemSVG =
    '<svg viewBox="0 0 26 74">' +
      '<line x1="13" y1="22" x2="13" y2="74" stroke="#8fae7d" stroke-width="2"/>' +
      '<g transform="translate(13,13)">' +
        '<circle cx="0" cy="-8" r="6" fill="#f0a6bc"/>' +
        '<circle cx="7" cy="-4" r="6" fill="#f0a6bc"/>' +
        '<circle cx="7" cy="5" r="6" fill="#f0a6bc"/>' +
        '<circle cx="0" cy="9" r="6" fill="#f0a6bc"/>' +
        '<circle cx="-7" cy="5" r="6" fill="#f0a6bc"/>' +
        '<circle cx="-7" cy="-4" r="6" fill="#f0a6bc"/>' +
        '<circle cx="0" cy="0" r="5" fill="#d8b48c"/>' +
      '</g>' +
    '</svg>';

  var FLOWER_STEM_SPOTS = [
    { top: "32%", left: "16%" },
    { top: "68%", left: "22%" },
    { top: "40%", left: "84%" },
    { top: "78%", left: "88%" }
  ];

  var ZONE_PETAL_SPOTS = [
    { top: "6%", left: "45%" },
    { top: "9%", left: "55%" },
    { top: "28%", left: "18%" },
    { top: "50%", left: "14%" },
    { top: "30%", left: "82%" },
    { top: "55%", left: "86%" }
  ];

  var ZONE_HEART_SPOTS = [
    { top: "4%", left: "38%" },
    { top: "18%", left: "20%" },
    { top: "44%", left: "16%" },
    { top: "20%", left: "80%" },
    { top: "46%", left: "84%" }
  ];

  function vineSVG() {
    return (
      '<svg viewBox="0 0 26 800" preserveAspectRatio="none">' +
        '<path d="M13 0 C 4 60, 22 120, 13 180 S 4 300, 13 360 S 22 480, 13 540 S 4 660, 13 720 S 22 780, 13 800" ' +
              'fill="none" stroke="#8fae7d" stroke-width="2"/>' +
        '<g fill="#a8c78f">' +
          '<ellipse cx="4" cy="90" rx="7" ry="3.5" transform="rotate(-30 4 90)"/>' +
          '<ellipse cx="22" cy="210" rx="7" ry="3.5" transform="rotate(30 22 210)"/>' +
          '<ellipse cx="4" cy="330" rx="7" ry="3.5" transform="rotate(-30 4 330)"/>' +
          '<ellipse cx="22" cy="450" rx="7" ry="3.5" transform="rotate(30 22 450)"/>' +
          '<ellipse cx="4" cy="570" rx="7" ry="3.5" transform="rotate(-30 4 570)"/>' +
          '<ellipse cx="22" cy="690" rx="7" ry="3.5" transform="rotate(30 22 690)"/>' +
        '</g>' +
      '</svg>'
    );
  }

  function spawnGarland(container) {
    var garland = document.createElement("div");
    garland.className = "garland";
    garland.setAttribute("aria-hidden", "true");

    var string = document.createElement("div");
    string.className = "garland-string";
    garland.appendChild(string);

    for (var i = 0; i < FLAG_COUNT; i++) {
      var flag = document.createElement("div");
      flag.className = "garland-flag";
      flag.style.left = ((i / (FLAG_COUNT - 1)) * 100) + "%";
      flag.style.background = FLAG_COLORS[i % FLAG_COLORS.length];
      flag.style.animationDelay = (i * 0.15) + "s";
      garland.appendChild(flag);
    }

    container.appendChild(garland);
  }

  function spawnFlowerStems(layer) {
    for (var i = 0; i < FLOWER_STEM_SPOTS.length; i++) {
      var spot = FLOWER_STEM_SPOTS[i];
      var el = document.createElement("div");
      el.className = "deco-flower-stem";
      el.style.top = spot.top;
      el.style.left = spot.left;
      el.style.animationDelay = (i * 0.3) + "s";
      el.innerHTML = flowerStemSVG;
      layer.appendChild(el);
    }
  }

  function spawnVines(layer) {
    var left = document.createElement("div");
    left.className = "deco-vine left";
    left.innerHTML = vineSVG();
    layer.appendChild(left);

    var right = document.createElement("div");
    right.className = "deco-vine right";
    right.innerHTML = vineSVG();
    layer.appendChild(right);
  }

  function spawnZonePetals(layer) {
    for (var i = 0; i < ZONE_PETAL_SPOTS.length; i++) {
      var spot = ZONE_PETAL_SPOTS[i];
      var el = document.createElement("div");
      el.className = "zone-petal";
      el.textContent = "🌸";
      el.style.top = spot.top;
      el.style.left = spot.left;
      el.style.animationDelay = (i * 0.55) + "s";
      el.style.setProperty("--zd", ((i % 3) * 8 - 8) + "px");
      layer.appendChild(el);
    }
  }

  function spawnZoneHearts(layer) {
    for (var i = 0; i < ZONE_HEART_SPOTS.length; i++) {
      var spot = ZONE_HEART_SPOTS[i];
      var el = document.createElement("div");
      el.className = "zone-heart";
      el.textContent = "♡";
      el.style.top = spot.top;
      el.style.left = spot.left;
      el.style.animationDelay = (i * 0.5) + "s";
      el.style.setProperty("--zd", ((-1 * (i % 3)) * 8 + 8) + "px");
      layer.appendChild(el);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var hero = document.querySelector(".hero");
    if (!hero) return;

    spawnGarland(hero);

    var layer = hero.querySelector(".deco-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "deco-layer";
      layer.setAttribute("aria-hidden", "true");
      hero.appendChild(layer);
    }

    spawnFlowerStems(layer);
    spawnVines(layer);
    spawnZonePetals(layer);
    spawnZoneHearts(layer);
  });

})();
