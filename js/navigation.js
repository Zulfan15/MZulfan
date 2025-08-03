// Enhanced Navigation and UX JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize all components
    initNavigation();
    initSectionIndicators();
    initBreadcrumb();
    initFormValidation();
    initScrollAnimations();
    
    // Navigation handling
    function initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                // Update aria attributes
                const isExpanded = navMenu.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isExpanded);
                navMenu.setAttribute('aria-hidden', !isExpanded);
            });
        }
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('aria-hidden', 'true');
                }
            });
        });
        
        // Improved smooth scrolling
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(targetId.substring(1));
                }
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
    }
    
    // Section indicators (desktop navigation dots)
    function initSectionIndicators() {
        const sections = document.querySelectorAll('section[id]');
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        
        sections.forEach(section => {
            const dot = document.createElement('div');
            dot.className = 'section-dot';
            dot.setAttribute('data-section', section.id);
            dot.setAttribute('title', `Go to ${section.id}`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            
            dot.addEventListener('click', () => scrollToSection(section.id));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToSection(section.id);
                }
            });
            
            indicator.appendChild(dot);
        });
        
        // Only show on desktop
        if (window.innerWidth > 768) {
            document.body.appendChild(indicator);
        }
        
        // Update on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768 && indicator.parentNode) {
                indicator.remove();
            } else if (window.innerWidth > 768 && !indicator.parentNode) {
                document.body.appendChild(indicator);
            }
        });
    }
    
    // Breadcrumb navigation
    function initBreadcrumb() {
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'breadcrumb';
        breadcrumb.setAttribute('role', 'navigation');
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        
        const breadcrumbItem = document.createElement('span');
        breadcrumbItem.className = 'breadcrumb-item';
        breadcrumb.appendChild(breadcrumbItem);
        
        document.body.appendChild(breadcrumb);
        
        // Update breadcrumb on scroll
        window.addEventListener('scroll', () => {
            const currentSection = getCurrentSection();
            if (currentSection) {
                breadcrumbItem.textContent = capitalize(currentSection);
                breadcrumb.classList.add('visible');
            } else {
                breadcrumb.classList.remove('visible');
            }
        }, { passive: true });
    }
    
    // Enhanced form validation
    function initFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', debounce(validateField, 300));
        });
        
        form.addEventListener('submit', handleFormSubmit);
        
        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            const fieldType = field.type;
            const isRequired = field.hasAttribute('required');
            
            removeFieldError(field);
            
            if (isRequired && !value) {
                showFieldError(field, 'This field is required');
                return false;
            }
            
            if (fieldType === 'email' && value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            
            showFieldSuccess(field);
            return true;
        }
        
        function handleFormSubmit(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField({ target: input })) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitForm(form);
            }
        }
        
        function submitForm(form) {
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                showNotification('Message sent successfully!', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }
    
    // Scroll animations
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('[data-animate]');
        
        if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -10% 0px'
            });

            animateElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for browsers without IntersectionObserver
            animateElements.forEach(el => el.classList.add('animate-in'));
        }
    }
    
    // Utility functions
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerOffset = 80;
            const elementPosition = section.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    function updateActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
        
        // Update section indicators
        const dots = document.querySelectorAll('.section-dot');
        dots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === sectionId) {
                dot.classList.add('active');
            }
        });
    }
    
    function updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                updateActiveNavLink(section.id);
            }
        });
    }
    
    function getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                return section.id;
            }
        }
        return null;
    }
    
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.form-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        field.classList.add('error');
    }
    
    function showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    function removeFieldError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error', 'success');
    }
    
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container') || createNotificationContainer();
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    
    function createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }
    
    // Global functions for onclick handlers
    window.scrollToContact = () => scrollToSection('contact');
    window.openProjectModal = (projectId) => {
        // Implement project modal functionality
        console.log('Opening project modal for:', projectId);
    };
    window.closeProjectModal = () => {
        // Implement close modal functionality
        console.log('Closing project modal');
    };
});
