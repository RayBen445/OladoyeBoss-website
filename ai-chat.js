/**
 * AI Chat Integration with Google AI (Gemini)
 * 
 * This script handles AI chat functionality using Google AI's Gemini API.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Get your Google AI API key from: https://ai.google.dev/
 * 2. In production (Vercel), set the API key as an environment variable: GOOGLE_AI_API_KEY
 * 3. For local development, you can set it in the code below (not recommended for production)
 * 
 * SECURITY NOTES:
 * - Never commit API keys to your repository
 * - Use environment variables in production
 * - The API key should be stored securely on the server side
 * - Consider rate limiting and usage monitoring
 */

class AIChat {
    constructor() {
        // CONFIGURATION: API settings
        this.apiKey = null; // Will be set from environment or config
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        // Chat configuration
        this.maxTokens = 1000;
        this.temperature = 0.7;
        this.conversationHistory = [];
        
        // DOM elements
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatForm = document.getElementById('chatForm');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statusText = document.getElementById('statusText');
        this.charCount = document.getElementById('charCount');
        this.clearChatBtn = document.getElementById('clearChatBtn');
        this.apiStatusBanner = document.getElementById('apiStatusBanner');
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the chat system
     */
    init() {
        this.setupEventListeners();
        this.setupSuggestedQuestions();
        this.loadAPIKey();
        this.updateStatus('ready', 'Ready to chat');
        
        // Load conversation history from localStorage
        this.loadConversationHistory();
    }

    /**
     * Check if backend API is available
     */
    async loadAPIKey() {
        try {
            // Test the backend API endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'test' // Simple test message
                })
            });

            if (response.ok) {
                // Backend is configured properly
                this.apiKey = 'BACKEND_CONFIGURED'; // Flag to indicate backend is available
                this.hideAPIKeyWarning();
                return true;
            } else {
                const errorData = await response.json();
                console.error('Backend API configuration error:', errorData);
                this.showAPIKeyWarning();
                return false;
            }
        } catch (error) {
            console.warn('Backend API not available, checking for direct client configuration...');
            
            // Fallback: Check if there's a client-side configuration (not recommended for production)
            // This allows local development with direct API key configuration
            if (window.GOOGLE_AI_API_KEY && window.GOOGLE_AI_API_KEY !== 'YOUR_GOOGLE_AI_API_KEY_HERE') {
                this.apiKey = window.GOOGLE_AI_API_KEY;
                this.hideAPIKeyWarning();
                console.warn('⚠️ Using client-side API key. This is not recommended for production.');
                return true;
            }
            
            this.showAPIKeyWarning();
            return false;
        }
    }

    /**
     * Show API key configuration warning
     */
    showAPIKeyWarning() {
        if (this.apiStatusBanner) {
            this.apiStatusBanner.style.display = 'block';
        }
        this.updateStatus('error', 'API key required');
        this.sendButton.disabled = true;
    }

    /**
     * Hide API key configuration warning
     */
    hideAPIKeyWarning() {
        if (this.apiStatusBanner) {
            this.apiStatusBanner.style.display = 'none';
        }
        this.updateStatus('ready', 'Ready to chat');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Input handling
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.toggleSendButton();
            this.autoResize();
        });

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Clear chat
        this.clearChatBtn.addEventListener('click', () => {
            this.clearConversation();
        });
    }

    /**
     * Setup suggested question buttons
     */
    setupSuggestedQuestions() {
        const suggestionButtons = document.querySelectorAll('.suggestion-btn');
        suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.getAttribute('data-question');
                this.messageInput.value = question;
                this.updateCharCount();
                this.toggleSendButton();
                this.messageInput.focus();
            });
        });
    }

    /**
     * Update character count
     */
    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = count;
        
        if (count > 800) {
            this.charCount.style.color = '#ff6b6b';
        } else if (count > 600) {
            this.charCount.style.color = '#ffd93d';
        } else {
            this.charCount.style.color = '#666';
        }
    }

    /**
     * Toggle send button state
     */
    toggleSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        const hasApiKey = this.apiKey && this.apiKey !== 'YOUR_GOOGLE_AI_API_KEY_HERE';
        this.sendButton.disabled = !hasText || !hasApiKey;
    }

    /**
     * Auto-resize textarea
     */
    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    /**
     * Update status indicator
     */
    updateStatus(status, text) {
        this.statusText.textContent = text;
        
        // Update status indicator color
        switch (status) {
            case 'ready':
                this.statusIndicator.style.color = '#4CAF50';
                break;
            case 'thinking':
                this.statusIndicator.style.color = '#FF9800';
                break;
            case 'error':
                this.statusIndicator.style.color = '#F44336';
                break;
            default:
                this.statusIndicator.style.color = '#666';
        }
    }

    /**
     * Send message to AI
     */
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Check API key/backend availability
        if (!this.apiKey || this.apiKey === 'YOUR_GOOGLE_AI_API_KEY_HERE') {
            this.showAPIKeyWarning();
            return;
        }

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.updateCharCount();
        this.toggleSendButton();
        this.autoResize();

        // Show thinking status
        this.updateStatus('thinking', 'AI is thinking...');
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Add AI response to chat
            this.addMessage(response, 'ai');
            this.updateStatus('ready', 'Ready to chat');
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'ai', true);
            this.updateStatus('error', 'Error occurred');
            
            // Reset to ready after a delay
            setTimeout(() => {
                this.updateStatus('ready', 'Ready to chat');
            }, 3000);
        }
    }

    /**
     * Get response from Google AI
     */
    async getAIResponse(message) {
        // If using backend API (recommended approach)
        if (this.apiKey === 'BACKEND_CONFIGURED') {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Backend API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.response;
        }

        // Fallback: Direct API call (for local development only)
        // This should only be used in development environments
        return await this.getDirectAIResponse(message);
    }

    /**
     * Direct API call to Google AI (fallback for development)
     * @private
     */
    async getDirectAIResponse(message) {
        // Check if we have a mock response function for testing
        if (typeof window.getMockAIResponse === 'function') {
            return await window.getMockAIResponse(message);
        }

        // Build conversation context for better responses
        const systemPrompt = `You are a helpful AI assistant for Faithjesus Oladoye's website, a Christian author, content creator, and pastor. 

Your role is to:
- Answer questions about faith, Christianity, and biblical topics
- Provide spiritual guidance and encouragement
- Recommend Christian books and resources
- Discuss ministry and leadership topics
- Offer prayer guidance and support

Always respond with:
- Biblical wisdom when appropriate
- Encouraging and uplifting tone
- Practical spiritual advice
- References to scripture when relevant
- Respect for different Christian denominations

Keep responses conversational, helpful, and rooted in Christian values.`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `${systemPrompt}\n\nUser: ${message}`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: this.temperature,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: this.maxTokens,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Google AI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from AI');
        }

        return data.candidates[0].content.parts[0].text;
    }

    /**
     * Add message to chat
     */
    addMessage(text, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (isError) {
            messageDiv.classList.add('error-message');
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'user' ? '👤' : '🤖'}
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(text)}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Save to conversation history
        this.conversationHistory.push({
            text,
            sender,
            timestamp: now.toISOString(),
            isError
        });
        
        this.saveConversationHistory();

        // Animate new message
        setTimeout(() => {
            messageDiv.classList.add('animate-in');
        }, 10);
    }

    /**
     * Format message text (handle line breaks, etc.)
     */
    formatMessage(text) {
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    /**
     * Clear conversation
     */
    clearConversation() {
        if (confirm('Are you sure you want to clear the conversation?')) {
            // Keep only the initial AI message
            const messages = this.chatMessages.querySelectorAll('.message');
            messages.forEach((message, index) => {
                if (index > 0) { // Keep the first message (greeting)
                    message.remove();
                }
            });

            // Clear history (except initial greeting)
            this.conversationHistory = this.conversationHistory.slice(0, 1);
            this.saveConversationHistory();
            
            this.updateStatus('ready', 'Ready to chat');
        }
    }

    /**
     * Save conversation history to localStorage
     */
    saveConversationHistory() {
        try {
            localStorage.setItem('ai_chat_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.warn('Could not save conversation history:', error);
        }
    }

    /**
     * Load conversation history from localStorage
     */
    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('ai_chat_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                
                // Restore messages (skip the initial greeting which is already in HTML)
                this.conversationHistory.slice(1).forEach(msg => {
                    this.addMessageToDOM(msg);
                });
            }
        } catch (error) {
            console.warn('Could not load conversation history:', error);
        }
    }

    /**
     * Add message to DOM (for loading history)
     */
    addMessageToDOM(msg) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender}-message`;
        
        if (msg.isError) {
            messageDiv.classList.add('error-message');
        }

        const time = new Date(msg.timestamp);
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${msg.sender === 'user' ? '👤' : '🤖'}
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(msg.text)}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
    }
}

// Initialize AI Chat when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('chatMessages')) {
        window.aiChat = new AIChat();
    }
});