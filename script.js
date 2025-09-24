document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Rotating Biblical Quotes in Header ---
    const quotes = [
        "For God so loved the world, that he gave his only Son...", // John 3:16
        "The Lord is my shepherd; I shall not want.", // Psalm 23:1
        "I can do all things through Christ who strengthens me.", // Philippians 4:13
        "Trust in the Lord with all your heart and lean not on your own understanding.", // Proverbs 3:5
        "For I know the plans I have for you, declares the Lord...", // Jeremiah 29:11
        "Be still, and know that I am God.", // Psalm 46:10
        "The fruit of the Spirit is love, joy, peace, patience, kindness...", // Galatians 5:22-23
        "It is by grace you have been saved, through faith...", // Ephesians 2:8
        "And we know that in all things God works for the good of those who love him...", // Romans 8:28
        "Your word is a lamp for my feet, a light on my path.", // Psalm 119:105
        "But seek first his kingdom and his righteousness...", // Matthew 6:33
        "Therefore, if anyone is in Christ, the new creation has come...", // 2 Corinthians 5:17
        "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly...", // Micah 6:8
        "Come to me, all you who are weary and burdened, and I will give you rest.", // Matthew 11:28
        "I have told you these things, so that in me you may have peace.", // John 16:33
        "Love is patient, love is kind. It does not envy, it does not boast...", // 1 Corinthians 13:4
        "Do not be anxious about anything, but in every situation...present your requests to God.", // Philippians 4:6
        "The steadfast love of the Lord never ceases; his mercies never come to an end.", // Lamentations 3:22
        "For where two or three gather in my name, there am I with them.", // Matthew 18:20
        "I am the way and the truth and the life. No one comes to the Father except through me." // John 14:6
    ];

    const taglineEl = document.querySelector('.tagline');
    if (taglineEl) {
        let quoteIndex = 0;
        setInterval(() => {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            taglineEl.style.opacity = 0;
            setTimeout(() => {
                taglineEl.textContent = `"${quotes[quoteIndex]}"`;
                taglineEl.style.opacity = 1;
            }, 500); // Fade transition time
        }, 8000); // 8 seconds
    }


    // --- 2. On-Scroll Animations ---
    const scrollSections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    scrollSections.forEach(section => {
        observer.observe(section);
    });


    // --- 3. Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }


    // --- 4. Video Filtering on videos.html ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const videoItems = document.querySelectorAll('.video-item');

    if (filterButtons.length > 0 && videoItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');

                // Show/hide video items
                videoItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 5. Typewriter effect on hero section ---
    // This is handled by CSS, but if we need more complex logic, it would go here.

    console.log('Core website script fully loaded and operational.');
});