// main.js

// Global state and constants
const ANIMATION_SETTINGS = {
    SCROLL_DEBOUNCE: 16,
    TRANSITION_DURATION: 800,
    PARTICLE_COUNT: 50,
    CHART_INTERVAL: 6000
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add a loading class to body initially
    document.body.classList.add('loading');
    
    // Remove loading class after a short delay
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        // Initialize the app
        const app = new PortfolioApp();
        app.initialize();
    }, 100);
});

class PortfolioApp {
    constructor() {
        this.scrollTimeout = null;
        this.lastScrollY = 0;
        this.isScrolling = false;
        this.observers = new Map();
    }

    initialize() {
        this.initSmoothScroll();
        this.initNavbar();
        this.setupScrollHandler();
        this.initAnimations();
        this.initLoader();

        if (window.location.pathname.includes('projects.html')) {
            this.initProjects();
        } else {
            this.initParallax();
            this.typeEffect();
        }

        // Initialize header transitions after everything else
        requestAnimationFrame(() => this.initHeaderTransition());
    }

    // Optimized scroll handler using requestAnimationFrame
    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.isScrolling = false;
                });
                this.isScrolling = true;
            }
        }, { passive: true });
    }

    handleScroll() {
        const scrolled = window.scrollY;
        
        // Update navbar
        this.updateNavbar(scrolled);

        // Update parallax elements
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.15}px)`;
        }

        // Update service cards with optimized transform
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.transform = `translateY(${-scrolled * (0.1 + index * 0.05)}px)`;
        });

        // Update skill cards with optimized transform
        this.updateSkillCards();

        this.lastScrollY = scrolled;
    }

    updateSkillCards() {
        if (!this.isInViewport('.skills-section')) return;

        document.querySelectorAll('.skill-card').forEach((card) => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const centerX = rect.left + rect.width / 2;
            const rotateX = (window.innerHeight / 2 - centerY) * 0.1;
            const rotateY = (window.innerWidth / 2 - centerX) * 0.1;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    }

    initNavbar() {
        this.nav = document.querySelector('.nav');
    }

    updateNavbar(scrolled) {
        if (!this.nav) return;
        
        const hasBackground = scrolled > 50;
        this.nav.style.background = hasBackground ? '#ffffff' : 'transparent';
        this.nav.style.boxShadow = hasBackground ? '0 2px 10px rgba(0,0,0,0.1)' : 'none';
    }

    // Intersection Observer setup with performance optimizations
    setupIntersectionObserver(options = {}) {
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        this.animateElement(entry.target);
                    });
                }
            });
        }, {
            threshold: options.threshold || 0.15,
            rootMargin: options.rootMargin || '-50px 0px'
        });
    }

    animateElement(element, delay = 0) {
        if (delay) {
            setTimeout(() => element.classList.add('visible'), delay);
        } else {
            element.classList.add('visible');
        }

        if (element.classList.contains('skills-grid') || 
            element.classList.contains('services-grid')) {
            Array.from(element.children).forEach((child, index) => {
                setTimeout(() => child.classList.add('visible'), index * 100);
            });
        }
    }

    // Smooth scroll with improved performance
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (!target) return;

                const headerOffset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                const startPosition = window.scrollY;
                const distance = targetPosition - headerOffset - startPosition;

                this.smoothScrollTo(startPosition, distance);
            });
        });
    }

    smoothScrollTo(startPosition, distance) {
        const startTime = performance.now();
        const duration = ANIMATION_SETTINGS.TRANSITION_DURATION;

        const animate = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, startPosition + distance * this.easeInOutCubic(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    isInViewport(selector) {
        const element = document.querySelector(selector);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Optimized particle system
    initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        this.createParticles(hero);
    }

    createParticles(container) {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < ANIMATION_SETTINGS.PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            Object.assign(particle.style, {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`
            });
            
            particle.style.height = particle.style.width;
            fragment.appendChild(particle);
        }

        container.appendChild(fragment);
    }

    // Typing effect with performance optimization
    typeEffect() {
        const element = document.querySelector('.typing-text');
        if (!element) return;

        const text = "Data Enthusiast";
        let index = 0;
        
        element.textContent = '';
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        };
        
        requestAnimationFrame(type);
    }

    // Optimized loader
    initLoader() {
        const loader = document.createElement('div');
        loader.className = 'loading';
        document.body.appendChild(loader);

        window.addEventListener('load', () => {
            requestAnimationFrame(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            });
        });
    }

    initProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Handle Power BI and Tableau filters
                if (filter === 'powerbi' || filter === 'Tableau') {
                    const projectsPage = 'projects-micro.html';
                    const section = filter === 'powerbi' ? '#powerbi-section' : '#tableau-section';
                    window.location.href = `${projectsPage}${section}`;
                }
            });
        });
    }
}

// Project handling
async function loadProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!projectsContainer) return;

    // Show loading state
    projectsContainer.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading projects...</p>
        </div>
    `;

    try {
        const jsonPath = window.location.pathname.includes('pages/projects.html') 
            ? '../../assets/data/projects.json' 
            : 'assets/data/projects.json';

        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error('Failed to load projects');
        
        const { projects } = await response.json();
        renderProjects(projects);
        
        // Setup filtering
        if (filterButtons?.length) {
            setupProjectFilters(filterButtons, projects);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = '<p class="error-message">Failed to load projects. Please try again later.</p>';
    }
}

// Contact form handling with improved error handling
if (document.getElementById('contact-form')) {
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));

            form.reset();
            alert('Thank you for your message! I will get back to you soon.');
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Sorry, there was an error sending your message. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}