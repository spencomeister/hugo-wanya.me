// Works Page Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach((carousel, carouselIndex) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const indicators = carousel.querySelectorAll('.indicator');
        
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

