/**
 * Telegram Bot Integration for Contact Form
 * 
 * This script handles sending contact form submissions to a Telegram chat
 * using the Telegram Bot API.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Telegram bot by messaging @BotFather on Telegram
 * 2. Get your bot token from BotFather 
 * 3. Replace YOUR_TELEGRAM_BOT_TOKEN_HERE with your actual bot token
 * 4. Get your chat ID by messaging your bot and visiting:
 *    https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
 * 5. Replace YOUR_CHAT_ID_HERE with your actual chat ID
 * 
 * SECURITY NOTES:
 * - In production, store credentials as environment variables
 * - Consider using a backend service instead of client-side API calls
 * - The bot token should be kept secure and not exposed in client code
 */

class TelegramContact {
    constructor() {
        // CONFIGURATION: Replace these placeholders with your actual values
        this.botToken = '8113980847:AAELB5KE3IGxJ4BON7wG6h7_Qs1oPy_sOto'; // Get from @BotFather
        this.chatId = '593933293'; // Your Telegram chat ID
        
        // Telegram Bot API endpoint
        this.apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        
        // Validate configuration
        this._validateConfig();
    }

    /**
     * Validates that the configuration is properly set up
     * @private
     */
    _validateConfig() {
        if (this.botToken === 'YOUR_TELEGRAM_BOT_TOKEN_HERE' || 
            this.chatId === 'YOUR_CHAT_ID_HERE') {
            console.warn('⚠️ Telegram bot is not configured. Please update telegram-contact.js with your bot token and chat ID.');
            return false;
        }
        return true;
    }

    /**
     * Formats the contact form data into a readable message
     * @param {Object} formData - The form data object
     * @returns {string} Formatted message
     */
    _formatMessage(formData) {
        const timestamp = new Date().toLocaleString();
        
        return `🔔 *New Contact Form Submission*

📅 *Date:* ${timestamp}
👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
💬 *Message:*
${formData.message}

---
Sent from: Oladoye Author Website`;
    }

    /**
     * Sends a message to Telegram using the Bot API
     * @param {Object} formData - The contact form data
     * @returns {Promise<Object>} API response
     */
    async sendMessage(formData) {
        // Check if configuration is valid
        if (!this._validateConfig()) {
            throw new Error('Telegram bot configuration is missing. Please check telegram-contact.js file.');
        }

        const message = this._formatMessage(formData);
        
        const payload = {
            chat_id: this.chatId,
            text: message,
            parse_mode: 'Markdown' // Enables formatting like *bold* and _italic_
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Telegram API Error: ${errorData.description || response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.ok) {
                throw new Error(`Telegram API Error: ${result.description}`);
            }

            return result;
        } catch (error) {
            // Log error for debugging (in production, use proper logging)
            console.error('Failed to send message to Telegram:', error);
            throw error;
        }
    }

    /**
     * Handles the contact form submission
     * @param {Event} event - The form submit event
     * @param {Function} statusCallback - Callback to update form status
     */
    async handleFormSubmission(event, statusCallback) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Validate form data
        if (!contactData.name || !contactData.email || !contactData.message) {
            statusCallback('Please fill in all required fields.', 'error');
            return;
        }

        // Show loading state
        statusCallback('Sending message...', 'loading');

        try {
            // Send to Telegram
            await this.sendMessage(contactData);
            
            // Show success message
            statusCallback('✅ Thank you for your message! It has been sent successfully. We will get back to you soon.', 'success');
            
            // Reset form
            event.target.reset();
            
        } catch (error) {
            // Show error message
            const errorMessage = error.message.includes('configuration') 
                ? '⚠️ Contact form is not fully configured. Please try again later or contact us directly.'
                : '❌ Sorry, there was an error sending your message. Please try again or contact us directly at the email address provided.';
            
            statusCallback(errorMessage, 'error');
        }
    }
}

// Export for use in other scripts
window.TelegramContact = TelegramContact;