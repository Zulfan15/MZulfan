// Optimized Performance JavaScript

// Critical functions that need to run immediately
(function() {
    'use strict';
    
    // Optimize loading screen
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Reduce loading time to 1.5 seconds max
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    loadingScreen.setAttribute('aria-hidden', 'true');
                }, 300);
            }, 1000); // Reduced from potentially longer time
        }
    }

    // Lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // Optimized scroll handler with throttling
    function initOptimizedScrolling() {
        let ticking = false;
        
        function updateScrollElements() {
            const scrolled = window.pageYOffset;
            const navbar = document.getElementById('navbar');
            const scrollProgress = document.querySelector('.scroll-progress-bar');
            
            // Navbar background on scroll
            if (navbar) {
                if (scrolled > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            // Scroll progress bar
            if (scrollProgress) {
                const winHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrolled / winHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';
            }
            
            ticking = false;
        }
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateScrollElements);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Conditional Particles.js loading
    function initParticlesConditionally() {
        // Only load particles on desktop and when user hasn't indicated reduced motion preference
        const shouldLoadParticles = window.innerWidth > 768 && 
                                   !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
                                   !('ontouchstart' in window); // Not a touch device
        
        if (shouldLoadParticles && typeof particlesJS !== 'undefined') {
            // Reduced particle count for better performance
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50 }, // Reduced from potentially higher number
                    color: { value: '#00d4aa' },
                    shape: { type: 'circle' },
                    opacity: {
                        value: 0.3,
                        random: true,
                        anim: { enable: true, speed: 0.5 }
                    },
                    size: {
                        value: 2,
                        random: true,
                        anim: { enable: true, speed: 1 }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00d4aa',
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'window',
                    events: {
                        onhover: { enable: false }, // Disabled for performance
                        onclick: { enable: false }, // Disabled for performance
                        resize: true
                    }
                },
                retina_detect: false // Disabled for performance
            });
        } else {
            // Hide particles container if not loading
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                particlesContainer.style.display = 'none';
            }
        }
    }

    // Optimized animations with Intersection Observer
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('[data-animate]');
        
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -10% 0px'
            });

            animateElements.forEach(el => {
                animationObserver.observe(el);
            });
        } else {
            // Fallback: show all elements immediately
            animateElements.forEach(el => {
                el.classList.add('animate-in');
            });
        }
    }

    // Debounced resize handler
    function initResizeHandler() {
        let resizeTimer;
        
        function handleResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Only necessary resize actions
                if (window.innerWidth <= 768) {
                    // Mobile specific adjustments
                    const particlesContainer = document.getElementById('particles-js');
                    if (particlesContainer) {
                        particlesContainer.style.display = 'none';
                    }
                }
            }, 250);
        }
        
        window.addEventListener('resize', handleResize, { passive: true });
    }

    // Critical Path CSS already loaded, now load non-critical
    function loadNonCriticalCSS() {
        const nonCriticalCSS = [
            'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
        ];
        
        nonCriticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.media = 'print';
            link.onload = function() { this.media = 'all'; };
            document.head.appendChild(link);
        });
    }

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        hideLoadingScreen();
        initLazyLoading();
        initOptimizedScrolling();
        initScrollAnimations();
        initResizeHandler();
        
        // Load non-critical resources after initial load
        setTimeout(() => {
            loadNonCriticalCSS();
            initParticlesConditionally();
        }, 100);
    });

    // Service Worker for caching (if supported)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

})();
