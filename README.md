# Personal Website for Faithjesus Oladoye

This repository contains the source code for the personal website of Faithjesus Oladoye, an author, content creator, and pastor.

## Features

*   **Modern & Responsive Design:** A visually appealing and mobile-friendly layout.
*   **Interactive Elements:** Engaging features like on-scroll animations and a typewriter effect.
*   **Blog & Book Showcase:** Sections dedicated to written content and published works.
*   **Video Gallery:** An organized collection of video content with filtering capabilities.
*   **AI-Powered Chat:** An integrated chat assistant powered by Google Gemini Pro.
*   **Telegram Contact Form:** A contact form that sends messages directly to a Telegram chat.

## Project Structure

```
/
├── index.html          # Home page
├── about.html          # About Me page
├── blog.html           # Blog page
├── books.html          # Book Store page
├── videos.html         # Video Store page
├── chat.html           # AI Chat page
├── contact.html        # Contact page
├── style.css           # Main stylesheet
├── script.js           # Core JavaScript for the site
├── ai-chat.js          # Frontend logic for the AI chat
├── telegram-contact.js # Logic for the Telegram contact form
├── api/
│   └── chat.js         # Vercel serverless function for the AI chat
├── assets/             # Directory for images, videos, etc.
├── package.json        # Project metadata and dependencies
├── .gitignore          # Files to be ignored by Git
├── README.md           # This file
└── DEPLOYMENT.md       # Deployment instructions
```

## Setup Instructions

### Telegram Contact Form

1.  **Create a Telegram Bot:**
    *   Open Telegram and search for the "BotFather" user.
    *   Start a chat and send the `/newbot` command.
    *   Follow the prompts to name your bot and choose a username.
    *   BotFather will provide you with a **Bot Token**. Keep this safe.

2.  **Get your Chat ID:**
    *   Search for your newly created bot on Telegram and send it a message.
    *   Open your web browser and go to `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` (replace `<YOUR_BOT_TOKEN>` with your token).
    *   Look for the `"chat":{"id":...}` field in the JSON response. This is your **Chat ID**.

3.  **Update the Script:**
    *   Open `telegram-contact.js`.
    *   Replace the placeholder values for `BOT_TOKEN` and `CHAT_ID` with your actual token and chat ID.

### AI Chat (Vercel Deployment)

1.  **Get a Google AI API Key:**
    *   Go to the [Google AI Studio](https://aistudio.google.com/) and create a new API key.

2.  **Deploy to Vercel:**
    *   Create a new project on Vercel and link it to your Git repository.
    *   In the project settings, go to "Environment Variables".
    *   Add a new variable named `GOOGLE_AI_API_KEY` and paste your Google AI API key as the value.

3.  **Redeploy:**
    *   Trigger a new deployment on Vercel to apply the environment variable.

Your AI Chat feature should now be live and functional.