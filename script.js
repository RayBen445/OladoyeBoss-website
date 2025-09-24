document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

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
                break;
        }
    }

    // Handle form submission with Telegram integration
    contactForm.addEventListener('submit', function(event) {
        // Use the Telegram contact handler
        telegramContact.handleFormSubmission(event, updateFormStatus);
    });
});
