// script.js

document.addEventListener('DOMContentLoaded', () => {

    const chatbotContainer = document.getElementById('chatbot-container');
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeButton = document.getElementById('close-button');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // --- Event Listeners ---
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    closeButton.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // This handles the form submission
    chatForm.addEventListener('submit', (event) => {
        // THIS IS THE FIX: It prevents the page from reloading
        event.preventDefault(); 

        const userMessage = chatInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user');
            sendMessageToAPI(userMessage);
            chatInput.value = '';
        }
    });

    // --- Helper Functions ---
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessageToAPI(message) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayMessage(data.answer, 'bot');

        } catch (error) {
            console.error('Error sending message to API:', error);
            displayMessage('Sorry, something went wrong. Please try again.', 'bot');
        }
    }
});