// Main JavaScript for WANYA WordPress Theme
document.addEventListener('DOMContentLoaded', function() {
    // Check for duplicate loading screens
    const loadingElements = document.querySelectorAll('#loading');
    const loading = document.getElementById('loading');
    
    if (loading) {
        // Show loading screen initially
        loading.style.display = 'flex';
        loading.style.opacity = '1';
        
        // Track image loading status
        const images = document.querySelectorAll('img');
        let totalImages = images.length;
        let loadedImages = 0;
        let failedImages = 0;
        
        // Monitor each image loading
        images.forEach((img, index) => {
            if (img.complete) {
                loadedImages++;
            } else {
                img.addEventListener('load', function() {
                    loadedImages++;
                    checkAllImagesLoaded();
                });
                
                img.addEventListener('error', function() {
                    failedImages++;
                    checkAllImagesLoaded();
                });
            }
        });
        
        function checkAllImagesLoaded() {
            const totalProcessed = loadedImages + failedImages;
            // Images processed
        }
        
        // Initial check for already loaded images
        checkAllImagesLoaded();
        
        // Hide loading screen after content loads
        window.addEventListener('load', function() {
            setTimeout(function() {
                loading.classList.add('hide');
                loading.style.opacity = '0';
                
                setTimeout(function() {
                    loading.style.display = 'none';
                }, 500);
            }, 1500);
        });
        
        // Fallback: Hide loading screen after maximum time
        setTimeout(function() {
            if (loading.style.display !== 'none') {
                loading.classList.add('hide');
                loading.style.opacity = '0';
                setTimeout(function() {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 5000);
    }
});

// Smooth Scrolling
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

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
});

// Parallax effect for decorative elements
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const elements = document.querySelectorAll('.element');
    
    elements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        
        // Limit the animation range to prevent elements from moving too far
        const limitedYPos = Math.max(-100, Math.min(100, yPos));
        
        element.style.transform = `translateY(${limitedYPos}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// Mobile Navigation Toggle
let mobileMenuInitialized = false;

const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav-list');
    
    if (!nav || !navList) return;
    
    if (window.innerWidth <= 768 && !mobileMenuInitialized) {
        // Add mobile menu functionality
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.classList.add('menu-toggle');
        menuToggle.style.cssText = `
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #333;
        `;
        
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('mobile-active');
        });
        
        // Insert before social links or at the end
        const socialLinks = document.querySelector('.social-links');
        if (socialLinks) {
            nav.insertBefore(menuToggle, socialLinks);
        } else {
            nav.appendChild(menuToggle);
        }
        
        // Style mobile menu
        navList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.98);
            flex-direction: column;
            padding: 1rem 0;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        `;
        
        // Add CSS for active state if not already added
        if (!document.querySelector('#mobile-menu-style')) {
            const style = document.createElement('style');
            style.id = 'mobile-menu-style';
            style.textContent = `
                .nav-list.mobile-active {
                    transform: translateY(0) !important;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                }
                
                @media (min-width: 769px) {
                    .menu-toggle {
                        display: none !important;
                    }
                    .nav-list {
                        position: static !important;
                        flex-direction: row !important;
                        background: none !important;
                        transform: none !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                        box-shadow: none !important;
                        padding: 0 !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        mobileMenuInitialized = true;
    } else if (window.innerWidth > 768 && mobileMenuInitialized) {
        // Remove mobile menu elements when switching to desktop
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.remove();
        }
        
        // Reset nav-list styles for desktop
        navList.style.cssText = '';
        navList.classList.remove('mobile-active');
        
        mobileMenuInitialized = false;
    }
};

// Initialize mobile menu on resize and load
window.addEventListener('resize', createMobileMenu);
window.addEventListener('load', createMobileMenu);

// Random positioning function
function setRandomPositions() {
    // Random positions for overlay images (within main image bounds)
    const overlayImages = document.querySelectorAll('.overlay-img');
    overlayImages.forEach(img => {
        const randomTop = Math.random() * 70 + 10; // 10% to 80% from top
        const randomLeft = Math.random() * 70 + 10; // 10% to 80% from left
        
        img.style.top = randomTop + '%';
        img.style.left = randomLeft + '%';
        img.style.right = 'auto';
        img.style.bottom = 'auto';
    });
    
    // Random positions for sparkles (within main image bounds)
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
        const randomTop = Math.random() * 70 + 15; // 15% to 85% from top
        const randomLeft = Math.random() * 70 + 15; // 15% to 85% from left
        
        sparkle.style.top = randomTop + '%';
        sparkle.style.left = randomLeft + '%';
        sparkle.style.right = 'auto';
        sparkle.style.bottom = 'auto';
    });
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Set random positions on load
    setRandomPositions();
    
    // Button hover effects
    const buttons = document.querySelectorAll('.section-btn, .contact-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add sparkle effect to decorative elements
    const elements = document.querySelectorAll('.element');
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'float 0.5s ease-in-out infinite, sparkle 1s ease-in-out';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animation = 'float 6s ease-in-out infinite';
        });
    });
    
    // Main image interactive effects
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        // Click animation
        mainImage.addEventListener('click', function() {
            this.style.animation = 'bounceHigh 0.6s ease-out, heartbeat 1s ease-in-out';
            
            setTimeout(() => {
                this.style.animation = 'bounceFloat 4s ease-in-out infinite';
            }, 1600);
        });
        
        // Double click for extra effect
        mainImage.addEventListener('dblclick', function() {
            this.style.animation = 'bounceHigh 0.4s ease-out, wiggle 0.5s ease-in-out 3, heartbeat 2s ease-in-out';
            
            // Add temporary sparkle burst
            createSparkleburst(this);
            
            setTimeout(() => {
                this.style.animation = 'bounceFloat 4s ease-in-out infinite';
            }, 2400);
        });
        
        // Random animation changes
        setInterval(() => {
            const animations = [
                'bounceFloat 4s ease-in-out infinite',
                'bounceFloat 3s ease-in-out infinite, wiggle 8s ease-in-out infinite',
                'heartbeat 6s ease-in-out infinite'
            ];
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            mainImage.style.animation = randomAnimation;
        }, 15000); // Change animation every 15 seconds
    }
    
    // Overlay images interactive effects
    const overlayImages = document.querySelectorAll('.overlay-img');
    overlayImages.forEach((img, index) => {
        // Click effect for overlay images
        img.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Animate clicked overlay
            this.style.animation = 'bounceHigh 0.5s ease-out';
            createSparkleburst(this);
            
            // Trigger different main image animations based on which overlay was clicked
            triggerMainImageAnimation(this.classList[1]); // overlay-6, overlay-7, etc.
            
            setTimeout(() => {
                // Restore original animation based on class
                if (this.classList.contains('overlay-6')) {
                    this.style.animation = 'floatSlow 6s ease-in-out infinite';
                } else if (this.classList.contains('overlay-7')) {
                    this.style.animation = 'floatMedium 5s ease-in-out infinite';
                } else if (this.classList.contains('overlay-8')) {
                    this.style.animation = 'floatFast 4s ease-in-out infinite';
                } else if (this.classList.contains('overlay-9')) {
                    this.style.animation = 'floatGentle 7s ease-in-out infinite';
                }
            }, 500);
        });
        
        // Random position shift every 20 seconds
        setInterval(() => {
            const randomX = Math.random() * 20 - 10; // -10px to +10px
            const randomY = Math.random() * 20 - 10; // -10px to +10px
            img.style.transform = `translate(${randomX}px, ${randomY}px)`;
            
            setTimeout(() => {
                img.style.transform = '';
            }, 2000);
        }, 20000 + (index * 5000)); // Stagger the timing for each image
    });
    
    // Sparkle effects click interaction
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach((sparkle, index) => {
        sparkle.style.cursor = 'pointer';
        sparkle.style.pointerEvents = 'auto';
        
        sparkle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Different sparkle effects based on sparkle type
            const sparkleType = this.classList[1]; // sparkle-1, sparkle-2, etc.
            triggerMainImageAnimation(sparkleType);
            
            // Animate the clicked sparkle
            this.style.animation = 'sparkleFloat 0.5s ease-out, sparkle 1s ease-in-out';
            createSparkleburst(this);
            
            setTimeout(() => {
                this.style.animation = 'sparkleFloat 3s ease-in-out infinite';
            }, 1500);
        });
    });

    initHeroCTAClick();
});

// Create sparkle burst effect
function createSparkleburst(element) {
    const sparkles = ['✨', '⭐', '💫', '🌟', '⚡'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 9999;
            animation: burstOut 1.5s ease-out forwards;
        `;
        
        // Random direction
        const angle = (i / 8) * 2 * Math.PI;
        const distance = 100 + Math.random() * 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        sparkle.style.setProperty('--endX', endX + 'px');
        sparkle.style.setProperty('--endY', endY + 'px');
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }
}

function initHeroCTAClick() {
    const heroCTA = findHeroCTAButton();
    if (!heroCTA) {
        return;
    }

    heroCTA.dataset.heroCta = 'true';

    const navigationDelay = parseInt(heroCTA.dataset.navigationDelay, 10) || 700;
    const targetUrl = resolveHeroTargetUrl(heroCTA);
    let isNavigating = false;

    heroCTA.addEventListener('click', function(event) {
        if (isNavigating) {
            event.preventDefault();
            return;
        }

        isNavigating = true;
        event.preventDefault();
        event.stopImmediatePropagation();

        animateHeroCTA(heroCTA, navigationDelay);

        setTimeout(() => {
            window.location.href = targetUrl;
        }, navigationDelay);
    }, true);
}

function findHeroCTAButton() {
    const selectors = [
        '[data-hero-cta]',
        '#hero .hero-cta',
        '#hero .cta-button',
        '#hero .section-btn',
        '#top .hero-cta',
        '#top .cta-button'
    ];

    for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
    }

    return null;
}

function resolveHeroTargetUrl(element) {
    const slug = (element.dataset.workSlug || 'luna-atelier').replace(/^\/+/g, '').replace(/\/+$/g, '');
    const defaultUrl = `/works/${slug}/`;
    const dataUrl = element.dataset.detailUrl || element.getAttribute('data-detail-url');
    const hrefValue = element.getAttribute('href');

    if (dataUrl && !dataUrl.startsWith('#')) {
        return dataUrl;
    }

    if (hrefValue && hrefValue !== '#' && !hrefValue.startsWith('#')) {
        return hrefValue;
    }

    return defaultUrl;
}

function animateHeroCTA(element, duration) {
    const animationName = element.dataset.clickAnimation || 'pulseWave';
    const easing = element.dataset.clickAnimationTiming || 'ease';
    const animationDuration = duration || 700;

    element.classList.add('hero-cta-animating');
    element.style.animation = `${animationName} ${animationDuration}ms ${easing}`;
    createSparkleburst(element);

    setTimeout(() => {
        element.classList.remove('hero-cta-animating');
        element.style.animation = '';
    }, animationDuration);
}

// Trigger different main image animations based on clicked element
function triggerMainImageAnimation(elementType) {
    const mainImage = document.getElementById('mainImage');
    if (!mainImage) return;
    
    // Store current animation to restore later
    const currentAnimation = mainImage.style.animation || 'bounceFloat 4s ease-in-out infinite';
    
    switch(elementType) {
        case 'overlay-6':
            // Spin and grow animation
            mainImage.style.animation = 'spinGrow 2s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 2000);
            break;
            
        case 'overlay-7':
            // Spiral dance animation
            mainImage.style.animation = 'spiralDance 2s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 2000);
            break;
            
        case 'overlay-8':
            // Cute bouncy squish animation
            mainImage.style.animation = 'cuteSquish 2.2s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 2200);
            break;
            
        case 'overlay-9':
            // Wave and glow animation
            mainImage.style.animation = 'waveGlow 2s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 2000);
            break;
            
        case 'sparkle-1':
            // Twinkle animation
            mainImage.style.animation = 'twinkleMain 1s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 1000);
            break;
            
        case 'sparkle-2':
            // Bounce sequence
            mainImage.style.animation = 'bounceSequence 1.8s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 1800);
            break;
            
        case 'sparkle-3':
            // Flip animation
            mainImage.style.animation = 'flipMain 1.5s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 1500);
            break;
            
        case 'sparkle-4':
            // Pulse wave
            mainImage.style.animation = 'pulseWave 2s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 2000);
            break;
            
        case 'sparkle-5':
            // Elastic bounce
            mainImage.style.animation = 'elasticBounce 2.2s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 2200);
            break;
            
        default:
            // Default sparkle effect
            mainImage.style.animation = 'heartbeat 1s ease-in-out, ' + currentAnimation;
            setTimeout(() => {
                mainImage.style.animation = currentAnimation;
            }, 1000);
            break;
    }
}

// Add sparkle animation and burst effect
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkle {
        0%, 100% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
        50% { filter: brightness(1.5) drop-shadow(0 0 15px currentColor); }
    }
    
    @keyframes burstOut {
        0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--endX), var(--endY)) scale(1.5) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sparkleStyle);

// Form handling (for contact form)
const contactForm = document.querySelector('#contact-form, #contactForm');
if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Add AJAX form submission here
            fetch(wanya_ajax.ajax_url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Message sent successfully!', 'success');
                    contactForm.reset();
                } else {
                    showNotification('Error sending message. Please try again.', 'error');
                }
            })
            .catch(error => {
                showNotification('Error sending message. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Image lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #a8e6cf 0%, #88d8c0 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        display: none;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.transform = 'translateY(0)';
            }, 100);
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
            setTimeout(() => {
                backToTopBtn.style.display = 'none';
            }, 300);
        }
    });
    
    // Back to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    .hero-content {
        opacity: 0;
        transform: translateY(30px);
        transition: all 1s ease;
    }
    
    .animate-in {
        animation: slideInUp 0.8s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .back-to-top:hover {
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }
    
    @media (max-width: 768px) {
        .back-to-top {
            bottom: 20px !important;
            right: 20px !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 1.2rem !important;
        }
    }
`;
document.head.appendChild(style);




