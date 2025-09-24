document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // --- IMPORTANT: Replace with your actual Bot Token and Chat ID ---
            // These are placeholders and must be configured for the form to work.
            const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
            const CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';

            // Show a "sending" message
            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#333';

            // Check if placeholder values are still being used
            if (BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN' || CHAT_ID === 'YOUR_TELEGRAM_CHAT_ID') {
                formStatus.textContent = 'Form is not configured. Please see setup instructions.';
                formStatus.style.color = 'red';
                console.error('Telegram Bot Token or Chat ID is not configured in telegram-contact.js');
                return;
            }

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Format the message for Telegram (using Markdown)
            const text = `
New Contact Form Submission
---------------------------
*Name:* ${name}
*Email:* ${email}
*Message:*
${message}
            `;

            const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

            const params = new URLSearchParams({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            });

            try {
                const response = await fetch(`${url}?${params.toString()}`, {
                    method: 'GET', // Telegram API can use GET for sendMessage
                });

                const data = await response.json();

                if (data.ok) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    throw new Error(data.description);
                }
            } catch (error) {
                console.error('Telegram API Error:', error);
                formStatus.textContent = `An error occurred: ${error.message}. Please try again later.`;
                formStatus.style.color = 'red';
            }
        });
    }
});