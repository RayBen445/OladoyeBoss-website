document.addEventListener('DOMContentLoaded', () => {
    // Contact form handling (only on contact page)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        // Initialize Telegram contact handler
        const telegramContact = new window.TelegramContact();

        /**
         * Updates the form status display with appropriate styling
         * @param {string} message - The message to display
         * @param {string} type - The type of message ('success', 'error', 'loading')
         */
        function updateFormStatus(message, type) {
            formStatus.textContent = message;
            
            // Remove previous status classes
            formStatus.classList.remove('status-success', 'status-error', 'status-loading');
            
            // Add appropriate class based on type
            switch (type) {
                case 'success':
                    formStatus.classList.add('status-success');
                    break;
                case 'error':
                    formStatus.classList.add('status-error');
                    break;
                case 'loading':
                    formStatus.classList.add('status-loading');
                    contactForm.classList.add('loading');
                    break;
            }

            // Remove loading class after non-loading states
            if (type !== 'loading') {
                contactForm.classList.remove('loading');
            }
        }

        // Handle form submission with Telegram integration
        contactForm.addEventListener('submit', function(event) {
            // Use the Telegram contact handler
            telegramContact.handleFormSubmission(event, updateFormStatus);
        });
    }

    // Scroll animations
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // Video filtering (on videos page)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoItems = document.querySelectorAll('.video-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            videoItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
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

    // Smooth scrolling for anchor links
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

    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('primary')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Add loading states to navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        // Skip anchor links
        if (!link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function() {
                // Add a subtle loading effect
                this.style.opacity = '0.7';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 500);
            });
        }
    });

    // Parallax effect for hero sections (if supported)
    const heroSections = document.querySelectorAll('.hero, .page-hero');
    
    function handleParallax() {
        const scrollTop = window.pageYOffset;
        
        heroSections.forEach(hero => {
            const rate = scrollTop * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Only add parallax on larger screens and if user hasn't requested reduced motion
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleParallax);
        });
    }

    // Enhanced form interactions
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    // Add a subtle animation to cards on hover
    const cards = document.querySelectorAll('.feature-card, .blog-post, .book-item, .video-item, .author-card, .contact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add typing effect restart on visibility (for hero typewriter)
    const typewriter = document.querySelector('.typewriter');
    if (typewriter) {
        const restartTyping = () => {
            typewriter.style.animation = 'none';
            setTimeout(() => {
                typewriter.style.animation = 'typing 4s steps(120, end) 0.5s 1 normal both';
            }, 100);
        };

        // Restart typing animation when coming back to tab
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(restartTyping, 500);
            }
        });
    }

    // Add progress indicator for long pages
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Only show progress bar if page is long enough
        if (docHeight > window.innerHeight) {
            let progressBar = document.querySelector('.scroll-progress');
            if (!progressBar) {
                progressBar = document.createElement('div');
                progressBar.className = 'scroll-progress';
                progressBar.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: var(--gold);
                    z-index: 1001;
                    transition: width 0.1s ease;
                `;
                document.body.appendChild(progressBar);
            }
            progressBar.style.width = `${scrollPercent}%`;
        }
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrollProgress);
    });

    // Initialize scroll progress
    updateScrollProgress();
});
