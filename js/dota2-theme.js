/* ========================================
   DOTA2 THEME - JavaScript Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // LOADING SCREEN - Quick Hide
    // ========================================
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 12, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(196, 168, 75, 0.2)';
        } else {
            navbar.style.background = 'linear-gradient(180deg, rgba(10, 10, 12, 0.98) 0%, rgba(10, 10, 12, 0.9) 100%)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(196, 168, 75, 0.2)';
        }
        
        lastScroll = currentScroll;
    });

    // ========================================
    // MOBILE NAVIGATION TOGGLE
    // ========================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll(
        '.mission-card, .portfolio-card, .timeline-path, .campaign-chapter, ' +
        '.hero-portrait-panel, .hero-lore-panel, .contact-item, .contact-card'
    );

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial styles for reveal elements
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // ========================================
    // PORTFOLIO FILTER
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ========================================
    // TYPING EFFECT FOR HERO SUBTITLE
    // ========================================
    const heroSubtitle = document.getElementById('hero-subtitle');
    const roles = [
        'Informatics Student',
        'Laboratory Assistant',
        'Software Developer',
        'Database Programmer',
        'Network Security Enthusiast'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            heroSubtitle.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroSubtitle.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    if (heroSubtitle) {
        setTimeout(typeEffect, 1500);
    }

    // ========================================
    // SKILL ITEM HOVER SOUND EFFECT (Visual)
    // ========================================
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });

    // ========================================
    // PARALLAX EFFECT FOR HERO
    // ========================================
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.backgroundPositionY = `calc(50% + ${rate}px)`;
        });
    }

    // ========================================
    // CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #92a525 0%, #6b7a1a 100%)';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // DOTA2 PARTICLE EFFECT (Subtle)
    // ========================================
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'dota-particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(196, 168, 75, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            left: ${Math.random() * 100}vw;
            top: 100vh;
            animation: floatUp ${5 + Math.random() * 10}s linear forwards;
            box-shadow: 0 0 10px rgba(196, 168, 75, 0.3);
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 15000);
    }

    // Add floating particles animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Create particles periodically
    setInterval(createParticle, 500);

    // ========================================
    // GLOWING BORDER EFFECT ON SCROLL
    // ========================================
    const glowElements = document.querySelectorAll('.skill-category, .portfolio-item, .timeline-content');
    
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 30px rgba(196, 168, 75, 0.4), inset 0 0 20px rgba(196, 168, 75, 0.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    });

    // ========================================
    // MISSION BOARD - XP COUNTER ANIMATION
    // ========================================
    const totalXpElement = document.getElementById('total-xp');
    let xpAnimated = false;

    function animateXP() {
        if (xpAnimated || !totalXpElement) return;
        
        const targetXP = 3850;
        let currentXP = 0;
        const duration = 2000;
        const increment = targetXP / (duration / 16);
        
        const xpInterval = setInterval(() => {
            currentXP += increment;
            if (currentXP >= targetXP) {
                currentXP = targetXP;
                clearInterval(xpInterval);
            }
            totalXpElement.textContent = Math.floor(currentXP).toLocaleString() + ' XP';
        }, 16);
        
        xpAnimated = true;
    }

    // Trigger XP animation when mission board is in view
    const missionBoard = document.querySelector('.mission-board');
    if (missionBoard) {
        const xpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateXP, 500);
                    xpObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        xpObserver.observe(missionBoard);
    }

    // ========================================
    // MISSION CARD HOVER EFFECTS
    // ========================================
    const missionCards = document.querySelectorAll('.mission-card');
    
    missionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle tilt effect
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            // Animate XP bar fill
            const xpFill = card.querySelector('.xp-fill');
            if (xpFill) {
                xpFill.style.boxShadow = '0 0 15px rgba(196, 168, 75, 0.6)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const xpFill = card.querySelector('.xp-fill');
            if (xpFill) {
                xpFill.style.boxShadow = '';
            }
        });
        
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ========================================
    // REWARD ITEMS STAGGER ANIMATION
    // ========================================
    const rewardItems = document.querySelectorAll('.reward-item');
    
    rewardItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
    });

    const rewardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.reward-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 50);
                });
            }
        });
    }, { threshold: 0.2 });

    missionCards.forEach(card => rewardObserver.observe(card));

    // ========================================
    // ARTIFACT ARMORY - Portfolio Filters
    // ========================================
    const armoryTabs = document.querySelectorAll('.armory-tab');
    const artifactCards = document.querySelectorAll('.artifact-card');
    
    armoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            armoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.getAttribute('data-filter');
            
            artifactCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ========================================
    // ARTIFACT CARD ANIMATIONS
    // ========================================
    artifactCards.forEach(card => {
        // 3D tilt effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 30;
            const rotateY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Glow effect follow mouse
        const glow = card.querySelector('.artifact-glow');
        if (glow) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                glow.style.left = `${x - rect.width}px`;
                glow.style.top = `${y - rect.height}px`;
            });
        }
    });

    // ========================================
    // ABILITY SLOTS ANIMATION
    // ========================================
    const abilitySlots = document.querySelectorAll('.ability-slot');
    
    abilitySlots.forEach((slot, index) => {
        slot.style.opacity = '0';
        slot.style.transform = 'scale(0.8)';
    });

    const abilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const slots = entry.target.querySelectorAll('.ability-slot');
                slots.forEach((slot, index) => {
                    setTimeout(() => {
                        slot.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        slot.style.opacity = '1';
                        slot.style.transform = 'scale(1)';
                    }, index * 100);
                });
                abilityObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const abilitiesGrid = document.querySelector('.abilities-grid');
    if (abilitiesGrid) {
        abilityObserver.observe(abilitiesGrid);
    }

    // ========================================
    // CAMPAIGN CHAPTER ANIMATIONS
    // ========================================
    const campaignChapters = document.querySelectorAll('.campaign-chapter');
    
    campaignChapters.forEach((chapter, index) => {
        chapter.style.opacity = '0';
        chapter.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
    });

    const chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'all 0.6s ease-out';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.2 });

    campaignChapters.forEach(chapter => chapterObserver.observe(chapter));

    // ========================================
    // SUMMARY STATS COUNTER ANIMATION
    // ========================================
    const summaryStats = document.querySelectorAll('.summary-stat .stat-value');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        
        summaryStats.forEach(stat => {
            const target = stat.textContent;
            const isNumber = !isNaN(parseInt(target));
            
            if (isNumber) {
                const endValue = parseInt(target);
                const suffix = target.replace(/[0-9]/g, '');
                let current = 0;
                const increment = endValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= endValue) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
            }
        });
        
        statsAnimated = true;
    }

    const campaignSummary = document.querySelector('.campaign-summary');
    if (campaignSummary) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(campaignSummary);
    }

    // ========================================
    // CONTACT FORM - Tavern Message
    // ========================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('.send-raven-btn');
            const btnContent = btn.querySelector('.btn-content');
            const raven = btn.querySelector('.raven-animation');
            
            // Animate raven flying
            btnContent.innerHTML = '<i class="fas fa-check"></i><span>Raven Sent!</span>';
            btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            
            if (raven) {
                raven.style.right = '20px';
                raven.style.opacity = '1';
                
                setTimeout(() => {
                    raven.style.right = '-100px';
                    raven.style.top = '-50px';
                }, 500);
            }
            
            // Reset after delay
            setTimeout(() => {
                btnContent.innerHTML = '<i class="fas fa-paper-plane"></i><span>Send Raven</span>';
                btn.style.background = '';
                if (raven) {
                    raven.style.right = '-50px';
                    raven.style.top = '';
                    raven.style.opacity = '0';
                }
                contactForm.reset();
            }, 3000);
        });
    }

    // ========================================
    // FORM FIELD FOCUS EFFECTS
    // ========================================
    const formFields = document.querySelectorAll('.form-field input, .form-field select, .form-field textarea');
    
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('focused');
        });
    });

    // ========================================
    // RAVEN BUTTON HOVER SOUNDS (Visual feedback)
    // ========================================
    const ravenBtns = document.querySelectorAll('.raven-btn');
    
    ravenBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ========================================
    // EQUIPMENT SLOT HOVER
    // ========================================
    const equipSlots = document.querySelectorAll('.equip-slot');
    
    equipSlots.forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            slot.style.transform = 'translateX(10px)';
        });
        
        slot.addEventListener('mouseleave', () => {
            slot.style.transform = '';
        });
    });

    // ========================================
    // CONTACT CARD STAGGER ANIMATION
    // ========================================
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
    });

    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.contact-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateX(0)';
                    }, index * 100);
                });
                contactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const contactCardsContainer = document.querySelector('.contact-cards');
    if (contactCardsContainer) {
        contactObserver.observe(contactCardsContainer);
    }

    // ========================================
    // ATTRIBUTE BARS ANIMATION
    // ========================================
    const attributes = document.querySelectorAll('.attribute');
    
    attributes.forEach((attr, index) => {
        attr.style.opacity = '0';
        attr.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            attr.style.transition = 'all 0.5s ease';
            attr.style.opacity = '1';
            attr.style.transform = 'translateY(0)';
        }, 1000 + (index * 150));
    });

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
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
    // ========================================
    // PARTICLES JS INITIALIZATION
    // ========================================
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#c4a84b" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 1, "direction": "top", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" }, "resize": true },
                "modes": { "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0, "speed": 3 }, "repulse": { "distance": 400, "duration": 0.4 } }
            },
            "retina_detect": true
        });
    }

    console.log('🎮 DOTA2 Theme loaded successfully!');
    console.log('⚔️ All sections animated: Character Sheet, Battle Campaign, Artifact Armory, Tavern');
});