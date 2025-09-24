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

    // Rotating Biblical Quotes System
    const rotatingQuoteElement = document.getElementById('rotatingQuote');
    if (rotatingQuoteElement) {
        const biblicalQuotes = [
            "The LORD bless you and keep you; the LORD make his face shine on you and be gracious to you; the LORD turn his face toward you and give you peace. — Numbers 6:24-26",
            "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint. — Isaiah 40:31",
            "He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God. — Micah 6:8",
            "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight. — Proverbs 3:5-6",
            "The LORD is my shepherd, I lack nothing. — Psalm 23:1",
            "When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you. — Isaiah 43:2",
            "I can do all this through him who gives me strength. — Philippians 4:13",
            "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future. — Jeremiah 29:11",
            "The LORD is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him. — Psalm 28:7",
            "He gives strength to the weary and increases the power of the weak. — Isaiah 40:29",
            "Be strong and courageous. Do not be afraid or terrified because of them, for the LORD your God goes with you; he will never leave you nor forsake you. — Deuteronomy 31:6",
            "A cheerful heart is good medicine, but a crushed spirit dries up the bones. — Proverbs 17:22",
            "The joy of the LORD is your strength. — Nehemiah 8:10",
            "Many are the plans in a person's heart, but it is the LORD's purpose that prevails. — Proverbs 19:21",
            "A person's wisdom yields patience; it is to one's glory to overlook an offense. — Proverbs 19:11",
            "The faithful love of the LORD never ends! His mercies never cease. Great is his faithfulness; his mercies begin afresh each morning. — Lamentations 3:22-23",
            "The LORD is good, a refuge in times of trouble. He cares for those who trust in him. — Nahum 1:7",
            "In all your ways acknowledge him, and he will make your paths straight. — Proverbs 3:6",
            "For where two or three are gathered in my name, there am I among them. — Matthew 18:20",
            "Commit to the LORD whatever you do, and he will establish your plans. — Proverbs 16:3",
            "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. — John 3:16",
            "I am the way and the truth and the life. No one comes to the Father except through me. — John 14:6",
            "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world. — John 16:33",
            "Let us hold unswervingly to the hope we profess, for he who promised is faithful. — Hebrews 10:23",
            "God is love. Whoever lives in love lives in God, and God in them. — 1 John 4:16",
            "You are the light of the world. A town on a hill cannot be hidden. — Matthew 5:14",
            "So faith comes from hearing, and hearing through the word of Christ. — Romans 10:17",
            "We live by faith, not by sight. — 2 Corinthians 5:7",
            "But seek first his kingdom and his righteousness, and all these things will be given to you as well. — Matthew 6:33",
            "So now faith, hope, and love abide, these three; but the greatest of these is love. — 1 Corinthians 13:13",
            "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here! — 2 Corinthians 5:17",
            "For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God. — Ephesians 2:8",
            "And my God will meet all your needs according to the riches of his glory in Christ Jesus. — Philippians 4:19",
            "The peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus. — Philippians 4:7",
            "Do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble. — Matthew 6:34",
            "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things. — Philippians 4:8",
            "Come to me, all you who are weary and burdened, and I will give you rest. — Matthew 11:28",
            "Give thanks in all circumstances; for this is God's will for you in Christ Jesus. — 1 Thessalonians 5:18",
            "He heals the brokenhearted and binds up their wounds. — Psalm 147:3",
            "The Lord is close to the brokenhearted and saves those who are crushed in spirit. — Psalm 34:18",
            "But blessed is the one who trusts in the LORD, whose confidence is in him. — Jeremiah 17:7",
            "For where your treasure is, there your heart will be also. — Matthew 6:21",
            "I will lie down and sleep in peace, for you alone, O LORD, make me dwell in safety. — Psalm 4:8",
            "Teach us to number our days, that we may gain a heart of wisdom. — Psalm 90:12",
            "For with God nothing will be impossible. — Luke 1:37",
            "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand. — Isaiah 41:10",
            "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid? — Psalm 27:1",
            "We are more than conquerors through him who loved us. — Romans 8:37",
            "God is our refuge and strength, an ever-present help in trouble. — Psalm 46:1",
            "And we know that in all things God works for the good of those who love him, who have been called according to his purpose. — Romans 8:28",
            "Be still, and know that I am God. — Psalm 46:10",
            "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up. — Galatians 6:9",
            "Above all else, guard your heart, for everything you do flows from it. — Proverbs 4:23",
            "The grass withers and the flowers fall, but the word of our God endures forever. — Isaiah 40:8",
            "He who dwells in the shelter of the Most High will rest in the shadow of the Almighty. — Psalm 91:1",
            "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline. — 2 Timothy 1:7",
            "My grace is sufficient for you, for my power is made perfect in weakness. — 2 Corinthians 12:9",
            "Love the Lord your God with all your heart and with all your soul and with all your mind. — Matthew 22:37",
            "As I have loved you, so you must love one another. — John 13:34",
            "But when you pray, go into your room, close the door and pray to your Father, who is unseen. Then your Father, who sees what is done in secret, will reward you. — Matthew 6:6",
            "You did not choose me, but I chose you and appointed you so that you might go and bear fruit—fruit that will last. — John 15:16",
            "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. — Galatians 5:22-23"
        ];

        let currentQuoteIndex = 0;

        function updateQuote() {
            rotatingQuoteElement.style.opacity = '0';
            setTimeout(() => {
                rotatingQuoteElement.textContent = biblicalQuotes[currentQuoteIndex];
                rotatingQuoteElement.style.opacity = '1';
                currentQuoteIndex = (currentQuoteIndex + 1) % biblicalQuotes.length;
            }, 500);
        }

        // Set initial quote
        updateQuote();

        // Change quote every 8 seconds
        setInterval(updateQuote, 8000);
    }
});
