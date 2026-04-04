// Works Page — Single flat image carousel per category
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.image-carousel').forEach(initCarousel);

  // Smooth scroll for anchor links
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

function initCarousel(carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const indicators = carousel.querySelectorAll('.indicator');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;

  function go(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    indicators.forEach((d, i) => d.classList.toggle('active', i === current));
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

  // Touch
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
  });

  // Mouse drag
  let dragging = false;
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
}
