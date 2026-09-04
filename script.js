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
  var skills = [
    { title: "Ahli dalam mengubah hari mendung menjadi cerah",
      desc: "Cukup dengan satu pesan pendek atau satu tawa di telepon, mendung di kepalaku selalu berhasil sirna." },
    { title: "Pakar bersertifikat dalam memberikan pelukan terbaik",
      desc: "Entah ilmu dari mana, tapi pelukannya selalu tahu persis berapa lama aku butuh untuk merasa baik-baik saja lagi." },
    { title: "Profesional dalam membuatku rindu, bahkan saat masih di sebelahku",
      desc: "Sebuah paradoks yang belum bisa kujelaskan secara ilmiah sampai hari ini." },
    { title: "Spesialis pendengar keluh kesah tanpa pernah terlihat bosan",
      desc: "Cerita yang sama, diulang untuk ketiga kalinya, tetap disambut seolah baru pertama kali didengar." },
    { title: "Master dalam seni membuatku tertawa di waktu yang paling tidak tepat",
      desc: "Termasuk saat sedang serius, saat sedang marah, dan sekali waktu, saat sedang menangis." },
    { title: "Ahli strategi dalam memilih kata-kata yang menenangkan",
      desc: "Tahu persis kapan harus diam, kapan harus memeluk, dan kapan harus bicara." },
    { title: "Kurator terpercaya untuk playlist lagu di saat yang tepat",
      desc: "Selalu tahu lagu mana yang cocok untuk suasana hatiku, bahkan sebelum aku sendiri menyadarinya." },
    { title: "Teknisi andal dalam merapikan kekacauan di kepalaku",
      desc: "Satu per satu, pelan-pelan, tanpa pernah terburu-buru atau menghakimi." },
    { title: "Desainer utama dari senyum yang paling sering muncul di wajahku",
      desc: "Karyanya konsisten, orisinal, dan tidak pernah gagal menembus hari terburuk sekalipun." },
    { title: "Pemegang rekor sebagai alasan aku ingin pulang lebih cepat",
      desc: "Tidak peduli seberapa jauh atau seberapa lelah, satu nama ini selalu jadi tujuan." },
    { title: "Ahli gizi emosional yang selalu tahu kapan aku butuh camilan hati",
      desc: "Satu kata manis darimu, lebih menyehatkan dari segala vitamin yang ada." },
    { title: "Penjaga malam terbaik saat aku sulit tidur karena overthinking",
      desc: "Selalu ada kata-kata yang membuatku akhirnya bisa menutup mata dengan tenang." },
    { title: "Arsitek kenangan indah yang sengaja dirancang untuk kita berdua",
      desc: "Setiap momen kecil bersamamu terasa seperti pameran seni yang tak pernah selesai." },
    { title: "Dokter spesialis hati yang tidak pernah gagal mendiagnosis masalahku",
      desc: "Satu senyummu sudah cukup untuk mengobati semua kekhawatiran yang kupunya." },
    { title: "Penerjemah bahasa tubuh yang paling akurat",
      desc: "Tahu kapan aku sedang baik-baik saja, dan kapan aku sebenarnya butuh dipeluk tanpa ditanya." },
    { title: "Ahli fisika quantum dalam menciptakan waktu yang terasa berhenti",
      desc: "Setiap kali kita bersama, detik-detik berjalan terlalu cepat seolah gravitasi tidak berlaku." },
    { title: "Programmer jitu yang selalu bisa me-reboot mood burukku",
      desc: "Satu bug di hari ku, satu hotfix darimu — langsung everything running smooth lagi." },
    { title: "Chef Michelin star dalam memasak resep kesabaran",
      desc: "Bahan utamanya waktu, bumbu rahasia nya perhatian — dan hasilnya selalu membuatku merasa berharga." },
    { title: "Pelukis langit yang mengubah sore biasa jadi momen magis",
      desc: "Cukup duduk berdua denganmu, dan warna dunia langsung berubah jadi lebih hangat." },
    { title: "Penulis surat cinta yang tidak pernah kehabisan kata",
      desc: "Bahkan dalam diam, kamu selalu berhasil menulis puisi terindah di hatiku." }
  ];

  var photoCaptions = ["kita", "senyummu", "hari itu", "favoritku", "selalu", "kenangan", "tawa kita", "sore itu", "hariku", "dua"];
  var rotations = [-6, 5, -3, 4, -4, 6, -5, 3, -4, 5];

  /* ------------------------------------------------------------------
     2. render skill cards (vertical feed)
  ------------------------------------------------------------------- */
  var feed = document.getElementById("feed");

  skills.forEach(function(skill, i){
    var entry = document.createElement("div");
    entry.className = "entry " + (i % 2 === 0 ? "align-left" : "align-right");
    entry.innerHTML =
      '<div class="card">' +
        '<p class="card-title">' + skill.title + '</p>' +
        '<p class="card-desc">' + skill.desc + '</p>' +
      '</div>';
    feed.appendChild(entry);
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

  /* ------------------------------------------------------------------
     3b. auto-scroll photo strip
  ------------------------------------------------------------------- */
  var stripPaused = false;
  var scrollSpeed = 1;
  var scrollDir = 1;

  function autoScrollStrip(){
    if (!stripPaused && photoStrip.scrollWidth > photoStrip.clientWidth){
      photoStrip.scrollLeft += scrollSpeed * scrollDir;
      if (photoStrip.scrollLeft + photoStrip.clientWidth >= photoStrip.scrollWidth - 2){
        scrollDir = -1;
      } else if (photoStrip.scrollLeft <= 2){
        scrollDir = 1;
      }
    }
    requestAnimationFrame(autoScrollStrip);
  }
  requestAnimationFrame(autoScrollStrip);

  photoStrip.addEventListener("mouseenter", function(){ stripPaused = true; });
  photoStrip.addEventListener("mouseleave", function(){ stripPaused = false; });
  photoStrip.addEventListener("touchstart", function(){ stripPaused = true; }, { passive: true });
  photoStrip.addEventListener("touchend", function(){ setTimeout(function(){ stripPaused = false; }, 2000); });

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
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".entry").forEach(function(el){ revealObserver.observe(el); });

  /* ------------------------------------------------------------------
     5. floating heart particles in background
  ------------------------------------------------------------------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  }

  /* ------------------------------------------------------------------
     6. cursor heart trail
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
