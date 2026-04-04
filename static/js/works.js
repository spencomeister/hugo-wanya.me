// Works Page — Outer (work) + Inner (image) Carousel
document.addEventListener('DOMContentLoaded', function () {
  // --- Inner image carousels ---
  document.querySelectorAll('.inner-carousel').forEach(initInnerCarousel);

  // --- Outer work carousels ---
  document.querySelectorAll('.outer-carousel').forEach(initOuterCarousel);
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
  const infoPanel = carousel.closest('.carousel-container')?.querySelector('.work-info');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    indicators.forEach((d, i) => d.classList.toggle('active', i === current));
    updateSlideInfo(infoPanel, current);
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

/* ========== Slide info transitions ========== */
function updateSlideInfo(panel, index) {
  if (!panel) return;
  const infos = panel.querySelectorAll('.slide-info');

  const currentActive = panel.querySelector('.slide-info.active');
  const next = infos[index];
  if (!next || currentActive === next) return;

  if (currentActive) {
    currentActive.classList.add('exiting');
    currentActive.classList.remove('active', 'entering');
    setTimeout(() => {
      currentActive.style.display = 'none';
      currentActive.classList.remove('exiting');
    }, 300);
  }

  setTimeout(() => {
    next.style.display = 'block';
    next.classList.add('active', 'entering');
    setTimeout(() => next.classList.remove('entering'), 600);
  }, 100);
}
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Hide navigation buttons if only one slide
        if (totalSlides <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            const indicatorsContainer = carousel.querySelector('.carousel-indicators');
            if (indicatorsContainer) indicatorsContainer.style.display = 'none';
        }
        
        function updateCarousel() {
            // Move track
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update active slide
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentSlide);
            });
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
            
            // Update slide-info (text content based on current slide) with improved animation
            const workInfo = carousel.closest('.carousel-container').querySelector('.work-info');
            if (workInfo) {
                const slideInfos = workInfo.querySelectorAll('.slide-info');
                
                // Remove all active states first
                slideInfos.forEach(info => {
                    info.classList.remove('active', 'entering');
                });
                
                // Find currently visible slide-info and add exiting animation
                const currentActiveInfo = workInfo.querySelector('.slide-info:not([style*="display: none"])');
                if (currentActiveInfo && currentActiveInfo !== slideInfos[currentSlide]) {
                    currentActiveInfo.classList.add('exiting');
                    
                    // Hide current slide-info after exit animation
                    setTimeout(() => {
                        currentActiveInfo.style.display = 'none';
                        currentActiveInfo.classList.remove('exiting');
                    }, 300);
                    
                    // Show new slide-info after current one starts exiting
                    setTimeout(() => {
                        slideInfos[currentSlide].style.display = 'block';
                        slideInfos[currentSlide].classList.add('active', 'entering');
                        

                        
                        // Clean up entering class after animation
                        setTimeout(() => {
                            slideInfos[currentSlide].classList.remove('entering');
                        }, 600);
                    }, 100); // Start new animation slightly before old one finishes
                } else {
                    // No current active info or same slide, show immediately
                    slideInfos.forEach((info, index) => {
                        if (index === currentSlide) {
                            info.style.display = 'block';
                            info.classList.add('active', 'entering');
                            setTimeout(() => {
                                info.classList.remove('entering');
                            }, 600);
                        } else {
                            info.style.display = 'none';
                            info.classList.remove('active', 'entering', 'exiting');
                        }
                    });
                }
            }
            
            // Video control - play only active video, pause others
            const videos = carousel.querySelectorAll('video');
            if (videos.length > 0) {
                videos.forEach((video, index) => {
                    if (index === currentSlide) {                    video.play().catch(e => {
                        // Video autoplay prevented
                    });
                    } else {
                        video.pause();
                        video.currentTime = 0; // Reset to beginning
                    }
                });
            }
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }
        
        // Event listeners (only for multiple slides)
        if (totalSlides > 1) {
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => goToSlide(index));
            });
            
            // Keyboard navigation
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                }
            });
            
            // Touch/swipe support
            let startX = 0;
            let isDragging = false;
            
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            carousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
            });
            
            carousel.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                isDragging = false;
                
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                const threshold = 50;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            });
            
            // Mouse drag support
            let mouseStartX = 0;
            let isMouseDragging = false;
            
            carousel.addEventListener('mousedown', (e) => {
                mouseStartX = e.clientX;
                isMouseDragging = true;
                carousel.style.cursor = 'grabbing';
                e.preventDefault();
            });
            
            carousel.addEventListener('mousemove', (e) => {
                if (!isMouseDragging) return;
                e.preventDefault();
            });
            
            carousel.addEventListener('mouseup', (e) => {
                if (!isMouseDragging) return;
                isMouseDragging = false;
                carousel.style.cursor = 'grab';
                
                const endX = e.clientX;
                const diff = mouseStartX - endX;
                const threshold = 50;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (isMouseDragging) {
                    isMouseDragging = false;
                    carousel.style.cursor = 'grab';
                }
            });
        }
        
        // Auto-play (optional, commented out)
        /*
        setInterval(() => {
            nextSlide();
        }, 5000);
        */
        
        // Initialize
        if (totalSlides > 1) {
            carousel.style.cursor = 'grab';
        }
        
        // Set initial slide-info state
        const workInfo = carousel.closest('.carousel-container').querySelector('.work-info');
        if (workInfo) {
            const slideInfos = workInfo.querySelectorAll('.slide-info');
            slideInfos.forEach((info, index) => {
                if (index === 0) {
                    info.style.display = 'block';
                    info.classList.add('active');
                } else {
                    info.style.display = 'none';
                    info.classList.remove('active', 'entering', 'exiting');
                }
            });
        }
        
        // Initialize carousel state
        if (totalSlides > 1) {
            updateCarousel();
        } else {
            // For single slide, ensure video plays if present
            const videos = carousel.querySelectorAll('video');
            if (videos.length > 0) {
                videos[0].play().catch(e => {
                    // Video autoplay prevented
                });
            }
        }
    });
    
    // Loading screen control
    const loading = document.getElementById('loading');
    const videos = document.querySelectorAll('video');
    
    if (videos.length > 0) {
        let videosLoaded = 0;
        const totalVideos = videos.length;
        
        videos.forEach(video => {
            // Check if video can play through
            video.addEventListener('canplaythrough', () => {
                videosLoaded++;
                if (videosLoaded >= totalVideos) {
                    // All videos loaded, hide loading screen
                    setTimeout(() => {
                        if (loading) {
                            loading.style.opacity = '0';
                            setTimeout(() => {
                                loading.style.display = 'none';
                            }, 500);
                        }
                    }, 1000); // Show loading for at least 1 second
                }
            });
            
            // Fallback in case canplaythrough doesn't fire
            video.addEventListener('loadeddata', () => {
                if (!video.hasAttribute('data-loaded')) {
                    video.setAttribute('data-loaded', 'true');
                    videosLoaded++;
                    if (videosLoaded >= totalVideos) {
                        setTimeout(() => {
                            if (loading) {
                                loading.style.opacity = '0';
                                setTimeout(() => {
                                    loading.style.display = 'none';
                                }, 500);
                            }
                        }, 1500);
                    }
                }
            });
        });
        
        // Fallback timeout to hide loading screen after 5 seconds
        setTimeout(() => {
            if (loading && loading.style.display !== 'none') {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 5000);
    } else {
        // No videos, hide loading screen immediately
        setTimeout(() => {
            if (loading) {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 1000);
    }
    
    // Smooth scroll for page navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

