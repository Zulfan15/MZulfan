// Enhanced Portfolio Website JavaScript - Professional Developer Theme

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeLoadingScreen();
    initializeParticles();
    initializeNavigation();
    initializeTypingAnimation();
    initializeScrollAnimations();
    initializeStats();
    initializeSkillBars();
    initializePortfolioFilters();
    initializeContactForm();
    initializeThemeToggle();
    initializeScrollProgress();
    initializeBackToTop();
    
    // Remove loading screen after everything is loaded
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }, 3000);
});

// Loading Screen Animation
function initializeLoadingScreen() {
    const commands = [
        'npm install portfolio',
        'Setting up environment...',
        'Loading components...',
        'Initializing animations...',
        'Ready to showcase!'
    ];
    
    let commandIndex = 0;
    let charIndex = 0;
    const commandElement = document.getElementById('loading-command');
    
    if (!commandElement) return;
    
    function typeCommand() {
        if (commandIndex < commands.length) {
            const currentCommand = commands[commandIndex];
            
            if (charIndex < currentCommand.length) {
                commandElement.textContent = currentCommand.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeCommand, 50);
            } else {
                setTimeout(() => {
                    commandIndex++;
                    charIndex = 0;
                    if (commandIndex < commands.length) {
                        setTimeout(typeCommand, 500);
                    }
                }, 1000);
            }
        }
    }
    
    typeCommand();
}

// Particles.js Initialization
function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00d4aa' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00d4aa',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 400, line_linked: { opacity: 1 } },
                    bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            retina_detect: true
        });
    }
}

// Enhanced Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

// Enhanced Typing Animation
function initializeTypingAnimation() {
    const roles = [
        'Full Stack Developer',
        'Software Engineer',
        'Problem Solver',
        'Code Enthusiast',
        'Tech Innovator'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const subtitleElement = document.getElementById('hero-subtitle');
    
    if (!subtitleElement) return;
    
    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            subtitleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    typeEffect();
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-item, .portfolio-item, .timeline-item, .about-highlight');
    animateElements.forEach(el => observer.observe(el));
}

// Stats Counter Animation
function initializeStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    setTimeout(updateCount, 20);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCount();
        });
    };
    
    // Trigger stats animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(heroSection);
    }
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        });
    };
    
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(skillsSection);
    }
}

// Portfolio Filters
function initializePortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<div class="spinner"></div> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add transition class for smooth theme change
            document.documentElement.style.transition = 'all 0.3s ease';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Remove transition after change
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        });
    }
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Update theme toggle title
        themeToggle.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        
        // Update particles.js if it exists
        if (window.pJSDom && window.pJSDom.length > 0) {
            const particlesColor = theme === 'dark' ? '#00d4aa' : '#2d3748';
            window.pJSDom[0].pJS.particles.color.value = particlesColor;
            window.pJSDom[0].pJS.particles.line_linked.color = particlesColor;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }
}

// Scroll Progress Bar
function initializeScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Project Modal Functions
function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    // Project details data
    const projectDetails = {
        ecommerce: {
            title: 'E-Commerce Platform',
            description: 'A full-featured e-commerce platform built with modern web technologies. Features user authentication, payment processing, inventory management, and a comprehensive admin dashboard.',
            features: ['User Authentication & Authorization', 'Secure Payment Integration (Stripe)', 'Real-time Inventory Management', 'Admin Dashboard & Analytics', 'Shopping Cart & Wishlist', 'Order Tracking & History'],
            technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe API', 'JWT', 'Redux'],
            image: 'https://via.placeholder.com/600x400/1a1a1a/00d4aa?text=E-Commerce+Platform',
            liveUrl: '#',
            githubUrl: 'https://github.com/zulfan15'
        },
        taskmanager: {
            title: 'Task Management App',
            description: 'Real-time collaborative task management application with drag-and-drop functionality, team collaboration features, and project timeline visualization.',
            features: ['Real-time Collaboration', 'Drag & Drop Interface', 'Team Management', 'Progress Tracking', 'File Attachments', 'Email Notifications'],
            technologies: ['Next.js', 'Socket.io', 'PostgreSQL', 'Redis', 'Tailwind CSS', 'Prisma'],
            image: 'https://via.placeholder.com/600x400/1a1a1a/0070f3?text=Task+Management',
            liveUrl: '#',
            githubUrl: 'https://github.com/zulfan15'
        },
        restapi: {
            title: 'RESTful API Service',
            description: 'Scalable RESTful API service with comprehensive documentation, authentication, rate limiting, and monitoring capabilities.',
            features: ['RESTful Architecture', 'JWT Authentication', 'Rate Limiting', 'API Documentation', 'Data Validation', 'Error Handling'],
            technologies: ['Node.js', 'Express.js', 'MongoDB', 'Swagger', 'Jest', 'Docker'],
            image: 'https://via.placeholder.com/600x400/1a1a1a/ff6b6b?text=REST+API+Service',
            liveUrl: '#',
            githubUrl: 'https://github.com/zulfan15'
        },
        mobileapp: {
            title: 'React Native Mobile App',
            description: 'Cross-platform mobile application built with React Native, featuring offline capabilities, push notifications, and native performance.',
            features: ['Cross-platform Compatibility', 'Offline Data Sync', 'Push Notifications', 'Native Performance', 'Biometric Authentication', 'In-app Purchases'],
            technologies: ['React Native', 'TypeScript', 'Firebase', 'Redux Toolkit', 'AsyncStorage', 'Expo'],
            image: 'https://via.placeholder.com/600x400/1a1a1a/4ecdc4?text=Mobile+App',
            liveUrl: '#',
            githubUrl: 'https://github.com/zulfan15'
        },
        opensource: {
            title: 'Open Source Library',
            description: 'A lightweight, performant JavaScript library for modern web development with comprehensive documentation and TypeScript support.',
            features: ['TypeScript Support', 'Zero Dependencies', 'Tree Shaking', 'Comprehensive Tests', 'NPM Package', 'Community Driven'],
            technologies: ['TypeScript', 'Rollup', 'Jest', 'ESLint', 'Prettier', 'GitHub Actions'],
            image: 'https://via.placeholder.com/600x400/1a1a1a/95e1d3?text=Open+Source+Library',
            liveUrl: 'https://npmjs.com/package/my-library',
            githubUrl: 'https://github.com/zulfan15'
        },
        portfolio: {
            title: 'Portfolio Website',
            description: 'Modern, responsive portfolio website showcasing creative design, smooth animations, and optimized performance with SEO best practices.',
            features: ['Responsive Design', 'Smooth Animations', 'SEO Optimized', 'Contact Form Integration', 'Project Showcase', 'Performance Optimized'],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Particles.js', 'Webpack'],
            image: 'https://via.placeholder.com/600x400/1a1a1a/feca57?text=Portfolio+Website',
            liveUrl: '#',
            githubUrl: 'https://github.com/zulfan15'
        }
    };
    
    const project = projectDetails[projectId];
    if (!project) return;
    
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <img src="${project.image}" alt="${project.title}" class="project-modal-image">
            <div class="project-modal-info">
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                
                <div class="project-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-technologies">
                    <h3>Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="project-links">
                    <a href="${project.liveUrl}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                    <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">
                        <i class="fab fa-github"></i> View Code
                    </a>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Utility Functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'success') {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        pointer-events: all;
        margin-bottom: 10px;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Copy email function
function copyEmail() {
    const email = 'zulfan@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        showNotification('$ echo "Email copied to clipboard!"', 'success');
    });
}

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Force fix footer social media layout
    setTimeout(() => {
        const footerSocial = document.querySelector('.footer-social');
        if (footerSocial) {
            footerSocial.style.setProperty('display', 'flex', 'important');
            footerSocial.style.setProperty('flex-direction', 'row', 'important');
            footerSocial.style.setProperty('gap', '1rem', 'important');
            footerSocial.style.setProperty('margin-top', '1rem', 'important');
            footerSocial.style.setProperty('flex-wrap', 'wrap', 'important');
            footerSocial.style.setProperty('align-items', 'center', 'important');
            footerSocial.style.setProperty('justify-content', 'flex-start', 'important');
            console.log('Footer social fixed:', footerSocial);
        }
    }, 100);
});
