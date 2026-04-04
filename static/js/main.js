/* Main JavaScript — WANYA site */
(function () {
  'use strict';

  /* ===== Loading screen ===== */
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = 'flex';
    loading.style.opacity = '1';
    const hide = () => {
      loading.classList.add('hide');
      loading.style.opacity = '0';
      setTimeout(() => { loading.style.display = 'none'; }, 500);
    };
    window.addEventListener('load', () => setTimeout(hide, 1500));
    setTimeout(() => { if (loading.style.display !== 'none') hide(); }, 5000);
  }

  /* ===== Smooth scroll ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ===== Header shrink on scroll ===== */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ===== Hamburger menu ===== */
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('is-open');
      navList.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        navList.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ===== Scroll-reveal: .fade-up / .scale-in ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .scale-in').forEach(el => revealObserver.observe(el));

  /* ===== Stagger children ===== */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.transitionDelay = (i * 0.08) + 's';
    }
  });

  /* ===== Section reveal (index page) ===== */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.section').forEach(s => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(30px)';
    s.style.transition = 'opacity .8s ease, transform .8s ease';
    sectionObserver.observe(s);
  });

  /* ===== Parallax decorative elements ===== */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.element').forEach((el, i) => {
          const speed = 0.3 + i * 0.08;
          const y = Math.max(-80, Math.min(80, -(scrolled * speed)));
          el.style.transform = `translateY(${y}px) rotate(${scrolled * 0.03}deg)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ===== Random hero positions ===== */
  function setRandomPositions() {
    document.querySelectorAll('.overlay-img').forEach(img => {
      img.style.top = (Math.random() * 70 + 10) + '%';
      img.style.left = (Math.random() * 70 + 10) + '%';
      img.style.right = 'auto';
      img.style.bottom = 'auto';
    });
    document.querySelectorAll('.sparkle').forEach(sp => {
      sp.style.top = (Math.random() * 70 + 15) + '%';
      sp.style.left = (Math.random() * 70 + 15) + '%';
      sp.style.right = 'auto';
      sp.style.bottom = 'auto';
    });
  }
  setRandomPositions();

  /* ===== Button hover ===== */
  document.querySelectorAll('.section-btn, .contact-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function () { this.style.transform = 'translateY(-3px) scale(1.05)'; });
    btn.addEventListener('mouseleave', function () { this.style.transform = ''; });
  });

  /* ===== Main image interactions ===== */
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.addEventListener('click', function () {
      this.style.animation = 'bounceHigh .6s ease-out, heartbeat 1s ease-in-out';
      createSparkleburst(this);
      setTimeout(() => { this.style.animation = 'bounceFloat 4s ease-in-out infinite'; }, 1600);
    });
    mainImage.addEventListener('dblclick', function () {
      this.style.animation = 'bounceHigh .4s ease-out, wiggle .5s ease-in-out 3, heartbeat 2s ease-in-out';
      createSparkleburst(this);
      setTimeout(() => { this.style.animation = 'bounceFloat 4s ease-in-out infinite'; }, 2400);
    });
  }

  /* ===== Overlay image click ===== */
  document.querySelectorAll('.overlay-img').forEach(img => {
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      this.style.animation = 'bounceHigh .5s ease-out';
      createSparkleburst(this);
      triggerMainImageAnimation(this.classList[1]);
      setTimeout(() => {
        const cls = this.classList;
        if (cls.contains('overlay-6')) this.style.animation = 'floatSlow 6s ease-in-out infinite';
        else if (cls.contains('overlay-7')) this.style.animation = 'floatMedium 5s ease-in-out infinite';
        else if (cls.contains('overlay-8')) this.style.animation = 'floatFast 4s ease-in-out infinite';
        else if (cls.contains('overlay-9')) this.style.animation = 'floatGentle 7s ease-in-out infinite';
      }, 500);
    });
  });

  /* ===== Sparkle click ===== */
  document.querySelectorAll('.sparkle').forEach(sp => {
    sp.style.cursor = 'pointer';
    sp.style.pointerEvents = 'auto';
    sp.addEventListener('click', function (e) {
      e.stopPropagation();
      triggerMainImageAnimation(this.classList[1]);
      this.style.animation = 'sparkleFloat .5s ease-out, sparkle 1s ease-in-out';
      createSparkleburst(this);
      setTimeout(() => { this.style.animation = 'sparkleFloat 3s ease-in-out infinite'; }, 1500);
    });
  });

  /* ===== Hero CTA ===== */
  initHeroCTAClick();

  /* ===== Sparkle burst helper ===== */
  function createSparkleburst(element) {
    const icons = ['\u2728', '\u2B50', '\uD83D\uDCAB', '\uD83C\uDF1F', '\u26A1'];
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const sp = document.createElement('div');
      sp.textContent = icons[Math.floor(Math.random() * icons.length)];
      const angle = (i / 8) * 2 * Math.PI;
      const dist = 100 + Math.random() * 100;
      sp.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;font-size:1.5rem;pointer-events:none;z-index:9999;animation:burstOut 1.5s ease-out forwards;`;
      sp.style.setProperty('--endX', Math.cos(angle) * dist + 'px');
      sp.style.setProperty('--endY', Math.sin(angle) * dist + 'px');
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 1500);
    }
  }

  /* ===== Main-image animation triggers ===== */
  function triggerMainImageAnimation(type) {
    if (!mainImage) return;
    const cur = mainImage.style.animation || 'bounceFloat 4s ease-in-out infinite';
    const map = {
      'overlay-6': ['spinGrow 2s ease-in-out', 2000],
      'overlay-7': ['spiralDance 2s ease-in-out', 2000],
      'overlay-8': ['cuteSquish 2.2s ease-in-out', 2200],
      'overlay-9': ['waveGlow 2s ease-in-out', 2000],
      'sparkle-1': ['twinkleMain 1s ease-in-out', 1000],
      'sparkle-2': ['bounceSequence 1.8s ease-in-out', 1800],
      'sparkle-3': ['flipMain 1.5s ease-in-out', 1500],
      'sparkle-4': ['pulseWave 2s ease-in-out', 2000],
      'sparkle-5': ['elasticBounce 2.2s ease-in-out', 2200]
    };
    const entry = map[type] || ['heartbeat 1s ease-in-out', 1000];
    mainImage.style.animation = entry[0] + ', ' + cur;
    setTimeout(() => { mainImage.style.animation = cur; }, entry[1]);
  }

  /* ===== Hero CTA click animation ===== */
  function initHeroCTAClick() {
    const selectors = ['[data-hero-cta]', '#hero .hero-cta', '#hero .cta-button', '#hero .section-btn'];
    let cta = null;
    for (const s of selectors) { cta = document.querySelector(s); if (cta) break; }
    if (!cta) return;
    const delay = parseInt(cta.dataset.navigationDelay, 10) || 700;
    const href = cta.getAttribute('href');
    const target = (href && href !== '#' && !href.startsWith('#')) ? href : '/works/';
    let navigating = false;
    cta.addEventListener('click', function (e) {
      if (navigating) { e.preventDefault(); return; }
      navigating = true;
      e.preventDefault();
      cta.classList.add('hero-cta-animating');
      cta.style.animation = `pulseWave ${delay}ms ease`;
      createSparkleburst(cta);
      setTimeout(() => { window.location.href = target; }, delay);
    }, true);
  }

  /* ===== Inject keyframe styles ===== */
  const dynStyle = document.createElement('style');
  dynStyle.textContent = `
    @keyframes sparkle{0%,100%{filter:brightness(1) drop-shadow(0 0 5px currentColor)}50%{filter:brightness(1.5) drop-shadow(0 0 15px currentColor)}}
    @keyframes burstOut{0%{transform:translate(0,0) scale(0) rotate(0);opacity:1}100%{transform:translate(var(--endX),var(--endY)) scale(1.5) rotate(360deg);opacity:0}}
    .back-to-top:hover{transform:translateY(-2px) scale(1.1);box-shadow:0 5px 15px rgba(0,0,0,.2)}
  `;
  document.head.appendChild(dynStyle);

  /* ===== Back-to-top ===== */
  const btt = document.createElement('button');
  btt.innerHTML = '\u2191';
  btt.className = 'back-to-top';
  btt.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--c-mint,#a8e6cf),var(--c-mint-dark,#88d8c0));color:white;border:none;font-size:1.5rem;cursor:pointer;opacity:0;transform:translateY(20px);transition:all .3s ease;z-index:1000;display:none;';
  document.body.appendChild(btt);
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      btt.style.display = 'block';
      requestAnimationFrame(() => { btt.style.opacity = '1'; btt.style.transform = 'translateY(0)'; });
    } else {
      btt.style.opacity = '0';
      btt.style.transform = 'translateY(20px)';
      setTimeout(() => { btt.style.display = 'none'; }, 300);
    }
  }, { passive: true });
  btt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ===== FAQ accordion ===== */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (item) item.classList.toggle('active');
    });
  });
})();
