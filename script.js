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

  setTimeout(function(){
    bgMusic.play().catch(function(){});
  }, 2000);

  muteBtn.addEventListener("click", function(){
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
    localStorage.setItem("galeryMuted", bgMusic.muted);
  });

  /* ------------------------------------------------------------------
     1. content data — pulled straight from skills.md
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
      desc: "Tidak peduli seberapa jauh atau seberapa lelah, satu nama ini selalu jadi tujuan." }
  ];

  var photoCaptions = ["kita", "senyummu", "hari itu", "favoritku", "selalu"];
  var rotations = [-6, 5, -3, 4, -4];

  /* interleave: 2 cards, 1 photo, repeating — photo #5 slipped in one slot early
     so the feed still closes on a written note before the final quote. */
  var order = [];
  var photoIdx = 0, skillIdx = 0;
  var pattern = [2,2,2,2,1,2]; // cards-before-each-photo (last photo comes a little earlier)
  pattern.forEach(function(count, i){
    for (var k = 0; k < count && skillIdx < skills.length; k++){
      order.push({ type: "card", data: skills[skillIdx++] });
    }
    if (photoIdx < photoCaptions.length){
      order.push({ type: "photo", data: { caption: photoCaptions[photoIdx], rot: rotations[photoIdx] } });
      photoIdx++;
    }
  });
  while (skillIdx < skills.length){
    order.push({ type: "card", data: skills[skillIdx++] });
  }

  /* ------------------------------------------------------------------
     2. render
  ------------------------------------------------------------------- */
  var feed = document.getElementById("feed");
  var fileCounter = 0;

  order.forEach(function(item, i){
    var entry = document.createElement("div");
    entry.className = "entry " + (i % 2 === 0 ? "align-left" : "align-right");

    if (item.type === "card"){
      entry.innerHTML =
        '<div class="card">' +
          '<p class="card-title">' + item.data.title + '</p>' +
          '<p class="card-desc">' + item.data.desc + '</p>' +
        '</div>';
    } else {
      var inputId = "photo-upload-" + (fileCounter++);
      entry.setAttribute("data-rot", item.data.rot);
      entry.innerHTML =
        '<label class="polaroid" for="' + inputId + '">' +
          '<span class="tape"></span>' +
          '<div class="photo-inner">' +
            '<span class="hint-icon">♡</span>' +
            '<span class="hint-text">ketuk untuk<br>menambah foto</span>' +
          '</div>' +
          '<span class="photo-caption">' + item.data.caption + '</span>' +
          '<input type="file" id="' + inputId + '" accept="image/*">' +
        '</label>';
    }
    feed.appendChild(entry);
  });

  /* photo upload preview */
  feed.addEventListener("change", function(e){
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
     3. scroll reveal (Intersection Observer, staggered)
  ------------------------------------------------------------------- */
  var revealables = document.querySelectorAll(".entry");
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(en, idx){
      if (en.isIntersecting){
        var delay = (idx % 4) * 90;
        setTimeout(function(){ en.target.classList.add("is-visible"); }, delay);
        observer.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealables.forEach(function(el){ observer.observe(el); });

  /* ------------------------------------------------------------------
     4. floating heart particles in background
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

  /* closing quote reveal too */
  var closing = document.getElementById("closing-quote");
  var closeObs = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add("is-visible"); closeObs.unobserve(en.target); }
    });
  }, { threshold: 0.2 });
  closeObs.observe(closing);

  /* ------------------------------------------------------------------
     5. cursor heart trail
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
