// Works Page — Outer (work) + Inner (image) Carousel
document.addEventListener('DOMContentLoaded', function () {
  // --- Inner image carousels ---
  document.querySelectorAll('.inner-carousel').forEach(initInnerCarousel);

  // --- Outer work carousels ---
  document.querySelectorAll('.outer-carousel').forEach(initOuterCarousel);

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

/* ========== Inner (image) carousel ========== */
function initInnerCarousel(carousel) {
  const track = carousel.querySelector('.inner-track');
  const slides = carousel.querySelectorAll('.inner-slide');
  const dots = carousel.querySelectorAll('.inner-dot');
  const prevBtn = carousel.querySelector('.inner-btn.prev');
  const nextBtn = carousel.querySelector('.inner-btn.next');

  if (!track || slides.length <= 1) return;

  let current = 0;
  const total = slides.length;

  function go(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); go(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); go(current + 1); });
  dots.forEach((d, i) => d.addEventListener('click', (e) => { e.stopPropagation(); go(i); }));

  // Touch support
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? current + 1 : current - 1);
  });
}

/* ========== Outer (work) carousel ========== */
function initOuterCarousel(carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll(':scope > .carousel-track > .carousel-slide');
  const indicators = carousel.querySelectorAll('.indicator');
  const prevBtn = carousel.querySelector(':scope > .carousel-btn.prev');
  const nextBtn = carousel.querySelector(':scope > .carousel-btn.next');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    indicators.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function go(index) {
    current = ((index % total) + total) % total;
    update();
  }

  if (total <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    const ic = carousel.querySelector('.carousel-indicators');
    if (ic) ic.style.display = 'none';
    return;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => go(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(current + 1));
  indicators.forEach((d, i) => d.addEventListener('click', () => go(i)));

  // Keyboard
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(current - 1);
    else if (e.key === 'ArrowRight') go(current + 1);
  });

  // Touch / mouse drag
  let startX = 0, dragging = false;
  carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
  });

  carousel.addEventListener('mousedown', (e) => { startX = e.clientX; dragging = true; carousel.style.cursor = 'grabbing'; e.preventDefault(); });
  carousel.addEventListener('mouseup', (e) => {
    if (!dragging) return;
    dragging = false;
    carousel.style.cursor = 'grab';
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
  });
  carousel.addEventListener('mouseleave', () => { dragging = false; carousel.style.cursor = 'grab'; });
  carousel.style.cursor = 'grab';

  // Init
  update();
}

