document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // In a real website, you would send this data to a server.
        // For this static site, we will just show a success message.
        formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
        formStatus.style.color = 'green';
        contactForm.reset();
    });
});
