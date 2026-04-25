/**
 * ================================================================
 * WEDDING INVITATION — script.js  (VINTAGE GOLD THEME)
 * ================================================================
 * WHAT CHANGED FROM ORIGINAL:
 * • initPetals()      → replaced by initParticles() (gold dots)
 * • Canvas ID         → #particleCanvas (was #petalCanvas)
 * • CONFIG.PETAL_*    → CONFIG.PARTICLE_* with gold colours
 * • All other logic (opening, navbar, parallax, scroll-reveal,
 *   countdown, gallery, lightbox, wishes) is PRESERVED unchanged.
 * ================================================================
 * TABLE OF CONTENTS
 * 1.  Configuration  (✏️ EDIT wedding date here)
 * 2.  Opening Screen
 * 3.  Gold Particle Animation  ← CHANGED
 * 4.  Navbar Scroll Behaviour
 * 5.  Smooth Anchor Scrolling
 * 6.  Mobile Navigation Toggle
 * 7.  Parallax Hero Background
 * 8.  Scroll Reveal (IntersectionObserver)
 * 9.  Countdown Timer
 * 10. Gallery Slider + Touch Swipe
 * 11. Lightbox
 * 12. Guest Wishes Form
 * ================================================================
 */

'use strict';

/* ================================================================
   1. CONFIGURATION
   ✏️ EDIT: Set the actual wedding date / time here.
================================================================ */
const CONFIG = {
  // ✏️ Change to real wedding date: 'YYYY-MM-DDTHH:MM:SS'
  WEDDING_DATE: new Date('2026-05-10T11:30:00'),

  // Soft sparkle palette — blush pinks, pearls and pale golds
  // Elegant on both the pink opening screen and white sections
  PARTICLE_COLORS: [
    'rgba(239, 217, 78,  0.55)',   // pale gold fleck
    'rgba(201, 162, 39,  0.40)',   // muted deep gold
    'rgba(220, 180, 180, 0.45)',   // blush rose
    'rgba(240, 210, 210, 0.35)',   // soft petal pink
    'rgba(255, 245, 230, 0.50)',   // warm pearl white
    'rgba(200, 170, 170, 0.30)',   // dusty rose
    'rgba(247, 235, 200, 0.45)',   // champagne shimmer
  ],

  PARTICLE_COUNT: 42,
};


/* ================================================================
   2. OPENING SCREEN
   UNCHANGED — triggers CSS transition, then boots initAll()
================================================================ */
(function initOpeningScreen() {
  const openBtn     = document.getElementById('openInvitationBtn');
  const openScreen  = document.getElementById('openingScreen');
  const mainContent = document.getElementById('mainContent');

  if (!openBtn || !openScreen || !mainContent) return;

  openBtn.addEventListener('click', function () {
    openScreen.classList.add('closing');

    // ── START MUSIC on first user interaction ─────────────────
    // Browsers require a user gesture before audio can play.
    // The button click IS that gesture — perfect timing.
    startMusic();
    // ─────────────────────────────────────────────────────────

    openScreen.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'opacity') return;
      openScreen.removeEventListener('transitionend', handler);
      openScreen.style.display = 'none';

      mainContent.classList.add('revealed');
      initAll();
    });
  });
})();


/* ================================================================
   3. GOLD PARTICLE ANIMATION  ← CHANGED from petal animation
   Renders tiny floating gold rhombus / dot particles on canvas.
   Particles drift upward with a gentle sway — like floating dust
   caught in a shaft of light over aged parchment.
================================================================ */
function initParticles() {
  // CHANGE: canvas ID is now 'particleCanvas'
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];

  /** Resize canvas to viewport */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /**
   * Draw one particle — a soft 4-point sparkle / star shape.
   * More elegant than a rhombus; looks like light catching dust
   * on a luxurious wedding invitation card.
   */
  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color;

    // 4-point sparkle: two overlapping thin diamonds
    const s = p.size;
    const t = s * 0.28; // thin axis half-width

    ctx.beginPath();
    // Vertical diamond
    ctx.moveTo(0, -s);
    ctx.lineTo(t, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-t, 0);
    ctx.closePath();
    ctx.fill();

    // Horizontal diamond (rotated 90° naturally by coordinates)
    ctx.beginPath();
    ctx.moveTo(-s, 0);
    ctx.lineTo(0, t);
    ctx.lineTo(s, 0);
    ctx.lineTo(0, -t);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Spawn a fresh particle.
   * atBottom = true  → starts at bottom edge and drifts UP
   * atBottom = false → random position in viewport
   */
  function spawnParticle(atBottom) {
    return {
      x:          Math.random() * W,
      y:          atBottom ? H + 10 : Math.random() * H,
      size:       Math.random() * 2.8 + 1.2,         // 1.2–4px — delicate
      speedY:     -(Math.random() * 0.38 + 0.10),    // very slow upward drift
      speedX:     (Math.random() - 0.5) * 0.22,
      rotation:   Math.random() * Math.PI * 2,
      rotSpeed:   (Math.random() - 0.5) * 0.016,     // slow gentle spin
      opacity:    Math.random() * 0.45 + 0.10,        // subtle, never loud
      swayAmp:    Math.random() * 0.015 + 0.003,
      swayOffset: Math.random() * Math.PI * 2,
      color:      CONFIG.PARTICLE_COLORS[
                    Math.floor(Math.random() * CONFIG.PARTICLE_COLORS.length)
                  ],
      tick: 0,
    };
  }

  function populate() {
    particles = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      particles.push(spawnParticle(false));
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.tick++;

      // Move: upward drift + horizontal sway
      p.x += p.speedX + Math.sin(p.tick * p.swayAmp + p.swayOffset) * 0.45;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      drawParticle(p);

      // Recycle when it drifts off the top
      if (p.y < -10) {
        particles[i] = spawnParticle(true);
      }
      // Also recycle if it drifts off sides
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); populate(); }, { passive: true });
  resize();
  populate();
  loop();
}


/* ================================================================
   4. NAVBAR SCROLL BEHAVIOUR
   UNCHANGED — adds .scrolled shadow class after 60px scroll
================================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}


/* ================================================================
   5. SMOOTH ANCHOR SCROLLING
   UNCHANGED — offsets by fixed navbar height (64px)
================================================================ */
function initSmoothScroll() {
  const NAV_H = 64;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - NAV_H,
        behavior: 'smooth',
      });

      // Close mobile nav
      document.getElementById('navMobile')?.classList.remove('open');
      document.getElementById('navBurger')?.classList.remove('open');
    });
  });
}


/* ================================================================
   6. MOBILE NAVIGATION TOGGLE
   UNCHANGED
================================================================ */
function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');
  if (!burger || !mobile) return;

  burger.addEventListener('click', function () {
    this.classList.toggle('open');
    mobile.classList.toggle('open');
  });
}


/* ================================================================
   7. PARALLAX HERO BACKGROUND
   UNCHANGED — moves hero-bg at 40% scroll speed
================================================================ */
function initParallax() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.4}px)`;
  }, { passive: true });
}


/* ================================================================
   8. SCROLL REVEAL (IntersectionObserver)
   UNCHANGED — adds .visible to .reveal elements in viewport
================================================================ */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
}


/* ================================================================
   9. COUNTDOWN TIMER
   UNCHANGED — counts down to CONFIG.WEDDING_DATE
================================================================ */

function initCountdown() {
  const elDays    = document.getElementById('cdDays');
  const elHours   = document.getElementById('cdHours');
  const elMinutes = document.getElementById('cdMinutes');
  const elSeconds = document.getElementById('cdSeconds');

  if (!elDays) return;

  const pad = n => String(Math.max(0, n)).padStart(2, '0');

  function tick(el, val) {
    if (el.textContent !== val) {
      el.textContent = val;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  function update() {
    const diff = CONFIG.WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) {
      [elDays, elHours, elMinutes, elSeconds].forEach(el => tick(el, '00'));
      return;
    }
    const s = Math.floor(diff / 1000);
    tick(elDays,    pad(Math.floor(s / 86400)));
    tick(elHours,   pad(Math.floor((s % 86400) / 3600)));
    tick(elMinutes, pad(Math.floor((s % 3600) / 60)));
    tick(elSeconds, pad(s % 60));
  }

  update();
  setInterval(update, 1000);
}


/* ================================================================
   10. GALLERY SLIDER + TOUCH SWIPE
   UNCHANGED — horizontal slider with auto-advance and dots
================================================================ */
function initGallery() {
  const track    = document.getElementById('galleryTrack');
  const prevBtn  = document.getElementById('galleryPrev');
  const nextBtn  = document.getElementById('galleryNext');
  const dotsWrap = document.getElementById('galleryDots');

  if (!track) return;

  const slides = track.querySelectorAll('.gallery-slide');
  const total  = slides.length;
  let current  = 0;
  let autoTimer = null;

  // Build dot indicators
  const dots = [];
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className   = 'gallery-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
    dots.push(dot);
  });

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 5000); }
  function stopAuto()  { if (autoTimer) clearInterval(autoTimer); }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  // Touch swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
  }, { passive: true });

  // Click slide → open lightbox
  slides.forEach((slide, i) => slide.addEventListener('click', () => openLightbox(i)));

  // Keyboard (when lightbox closed)
  document.addEventListener('keydown', e => {
    if (document.getElementById('lightbox')?.classList.contains('active')) return;
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  startAuto();
}


/* ================================================================
   11. LIGHTBOX
   UNCHANGED — full-screen photo viewer with keyboard + swipe
================================================================ */
window.openLightbox = function () {};

function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbClose    = document.getElementById('lightboxClose');
  const lbPrev     = document.getElementById('lightboxPrev');
  const lbNext     = document.getElementById('lightboxNext');
  const lbCounter  = document.getElementById('lightboxCounter');
  const lbBackdrop = document.getElementById('lightboxBackdrop');

  if (!lightbox || !lbImg) return;

  const images = Array.from(document.querySelectorAll('.gallery-slide img'));
  const total  = images.length;
  let current  = 0;

  window.openLightbox = function (idx) {
    current = ((idx % total) + total) % total;
    show();
  };

  function show() {
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt;
    if (lbCounter) lbCounter.textContent = `${current + 1} / ${total}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 360);
  }

  function prev() { current = (current - 1 + total) % total; show(); }
  function next() { current = (current + 1) % total;         show(); }

  lbClose?.addEventListener('click', close);
  lbBackdrop?.addEventListener('click', close);
  lbPrev?.addEventListener('click', prev);
  lbNext?.addEventListener('click', next);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  let touchX = 0;
  lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  }, { passive: true });
}


/* ================================================================
   12. GUEST WISHES FORM
   UNCHANGED — client-side only, no backend
================================================================ */
function initWishes() {
  const submitBtn = document.getElementById('wishSubmit');
  const nameInput = document.getElementById('wishName');
  const msgInput  = document.getElementById('wishMessage');
  const wishList  = document.getElementById('wishList');
  const wishEmpty = document.getElementById('wishEmpty');

  if (!submitBtn || !wishList) return;

  // Seed example wishes
  [
    { name: 'Nguyễn Văn C', msg: 'Chúc mừng hạnh phúc! Wishing you a lifetime of love and laughter. 🌸' },
    { name: 'Trần Thị D',   msg: 'May your love be as timeless as the stars and as deep as the ocean. Congratulations!' },
  ].forEach(w => addCard(w.name, w.msg, false));

  submitBtn.addEventListener('click', function () {
    const name = nameInput?.value.trim() ?? '';
    const msg  = msgInput?.value.trim()  ?? '';

    if (!name || !msg) {
      const form = submitBtn.closest('.wish-form');
      if (form) {
        form.style.animation = 'shake .4s ease';
        setTimeout(() => { form.style.animation = ''; }, 430);
      }
      return;
    }

    addCard(name, msg, true);
    if (nameInput) nameInput.value = '';
    if (msgInput)  msgInput.value  = '';
    nameInput?.focus();
  });

  msgInput?.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') submitBtn.click();
  });

  function addCard(name, message, animate) {
    if (wishEmpty) wishEmpty.style.display = 'none';

    const date = new Date().toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });

    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <p class="wish-card-name">${esc(name)}</p>
      <p class="wish-card-msg">${esc(message)}</p>
      <p class="wish-card-time">${date}</p>
    `;

    wishList.insertBefore(card, wishList.firstChild);
    if (animate) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function esc(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}


/* ================================================================
   BOOT — called once opening animation completes
================================================================ */
function initAll() {
  initNavbar();
  initSmoothScroll();
  initMobileNav();
  initParallax();
  initScrollReveal();
  initCountdown();
  initGallery();
  initLightbox();
  initWishes();
  initMusicToggle();   /* show the floating button after opening */
}


/* ================================================================
   BACKGROUND MUSIC
   ── startMusic()     : called on opening-btn click (user gesture)
   ── initMusicToggle(): wires up the floating toggle button
================================================================ */

let _bgAudio = null;   /* module-level ref so toggle can reach it */

/**
 * startMusic — called on the button click that opens the invitation.
 * The browser gesture unlock lets .play() succeed without a catch.
 */
function startMusic() {
  _bgAudio = document.getElementById('bgMusic');
  if (!_bgAudio) return;

  // Gently fade in from silence so the music doesn't startle
  _bgAudio.volume = 0;
  const playPromise = _bgAudio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Fade volume up from 0 → 0.55 over ~1.8 s
        fadeVolume(_bgAudio, 0, 0.55, 1800);
      })
      .catch(() => {
        // Autoplay still blocked on some browsers — toggle button
        // will let user manually start. Mark as paused visually.
        const btn = document.getElementById('musicToggle');
        if (btn) btn.classList.add('music-toggle--paused');
      });
  }
}

/**
 * fadeVolume — smoothly ramps audio volume from `from` to `to`
 * over `duration` milliseconds using requestAnimationFrame.
 */
function fadeVolume(audio, from, to, duration) {
  const start   = performance.now();
  const delta   = to - from;

  function step(now) {
    const elapsed = Math.min(now - start, duration);
    audio.volume  = from + delta * (elapsed / duration);
    if (elapsed < duration) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/**
 * initMusicToggle — reveals the floating button and wires click.
 * Called inside initAll() so it appears after the opening closes.
 */
/**
 * initMusicToggle — reveals the floating button and wires click.
 */
function initMusicToggle() {
  const btn   = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;

  // 1. Hiện nút sau 600ms (giữ nguyên của bạn)
  setTimeout(() => {
    btn.classList.remove('music-toggle--hidden');
  }, 600);

  // 2. Hàm đồng bộ giao diện nút với trạng thái nhạc
  function syncState() {
    if (audio.paused) {
      btn.classList.add('music-toggle--paused');
      btn.setAttribute('aria-label', 'Play background music');
      btn.title = 'Play music';
    } else {
      btn.classList.remove('music-toggle--paused');
      btn.setAttribute('aria-label', 'Pause background music');
      btn.title = 'Pause music';
    }
  }

  // 3. ĐOẠN QUAN TRỌNG NHẤT: Bắt sự kiện Click trên điện thoại
  btn.addEventListener('click', function() {
    if (audio.paused) {
      audio.volume = 0.55; // Đặt âm lượng vừa phải
      audio.play();
    } else {
      audio.pause();
    }
    syncState(); // Cập nhật lại icon ngay lập tức
  });

  // 4. (Tùy chọn) Bắt trình duyệt tự động cập nhật icon nếu nhạc bị dừng đột ngột
  audio.addEventListener('play', syncState);
  audio.addEventListener('pause', syncState);

  // Chạy đồng bộ lần đầu
  syncState();
}

// MẸO CỰC HAY CHO MOBILE: 
// Ép nhạc tự động phát ngay lần chạm (click) ĐẦU TIÊN bất kỳ đâu trên màn hình
document.body.addEventListener('click', function firstInteraction() {
  const audio = document.getElementById('bgMusic');
  if (audio && audio.paused) {
    audio.play().then(() => {
      audio.volume = 0.55;
    }).catch(e => console.log("Trình duyệt vẫn chặn:", e));
  }
  // Xóa lắng nghe này đi sau khi chạm lần đầu để không bị chạy lặp lại
  document.body.removeEventListener('click', firstInteraction);
}, { once: true });
  // ── Sync initial visual state to audio state ────────────────
  function syncState() {
    if (audio.paused) {
      btn.classList.add('music-toggle--paused');
      btn.setAttribute('aria-label', 'Play background music');
      btn.title = 'Play music';
    } else {
      btn.classList.remove('music-toggle--paused');
      btn.setAttribute('aria-label', 'Pause background music');
      btn.title = 'Pause music';
    }
  }

  // ── Toggle play / pause on click ────────────────────────────
  btn.addEventListener('click', function () {
    if (audio.paused) {
      // Resume — fade back in smoothly from current volume
      const fromVol = audio.volume;
      audio.play().then(() => {
        fadeVolume(audio, fromVol, 0.55, 900);
        btn.classList.remove('music-toggle--paused');
        btn.setAttribute('aria-label', 'Pause background music');
        btn.title = 'Pause music';
      }).catch(() => {/* browser still blocking, keep paused state */});
    } else {
      // Pause — fade out first, then pause cleanly
      const fromVol = audio.volume;
      fadeVolume(audio, fromVol, 0, 700);
      setTimeout(() => {
        audio.pause();
        syncState();
      }, 720);
      btn.classList.add('music-toggle--paused');   /* immediate visual */
      btn.setAttribute('aria-label', 'Play background music');
      btn.title = 'Play music';
    }
  });

  // Keep visual in sync if audio ends unexpectedly (non-loop edge case)
  audio.addEventListener('pause', syncState);
  audio.addEventListener('play',  syncState);

  syncState();  /* set correct initial state */



/* ================================================================
   ALWAYS INIT PARTICLES
   Gold particles run on the opening screen AND main content.
   CHANGE: was initPetals(), now initParticles()
================================================================ */
document.addEventListener('DOMContentLoaded', initParticles);