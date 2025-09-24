document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatHistory = document.querySelector('.chat-history');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    let conversationHistory = [];

    // --- Function to add a message to the chat window ---
    function addMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.innerHTML = `<p>${message}</p>`; // Use innerHTML to render formatted text
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    }

    // --- Function to handle sending a message ---
    async function sendMessage(messageText) {
        if (!messageText.trim()) return;

        // Add user message to UI and history
        addMessage('user', messageText);
        conversationHistory.push({ role: 'user', parts: [{ text: messageText }] });
        userInput.value = '';

        // Add a temporary "typing" indicator for the AI
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'ai-message', 'typing');
        typingIndicator.innerHTML = `<p>...</p>`;
        chatHistory.appendChild(typingIndicator);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            // --- Attempt to use backend first ---
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ history: conversationHistory }),
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.response;
            
            // Remove typing indicator and add AI response
            chatHistory.removeChild(typingIndicator);
            addMessage('ai', aiResponse);
            conversationHistory.push({ role: 'model', parts: [{ text: aiResponse }] });

        } catch (error) {
            console.error('Error communicating with backend:', error);
            chatHistory.removeChild(typingIndicator);
            addMessage('ai', 'Sorry, I am having trouble connecting to my brain right now. Please try again later.');
        }
    }

    // --- Event Listeners ---
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage(userInput.value);
        });
    }

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.textContent;
            sendMessage(btn.textContent);
        });
    });

    console.log('AI Chat script fully loaded and operational.');
});