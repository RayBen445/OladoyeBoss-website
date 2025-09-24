# Oladoye Author and Kingdom Voice Website

A personal website for Heritage Oladoye featuring blog posts, book store, video store, and contact functionality with Telegram bot integration.

## Features

- **Blog Section**: Latest posts and updates
- **About Section**: Personal introduction
- **Book Store**: Showcase of published books
- **Video Store**: Embedded video content
- **Contact Form**: Direct messaging via Telegram bot integration

## Telegram Bot Setup

The contact form is integrated with a Telegram bot to automatically forward messages to your Telegram chat. Follow these steps to configure it:

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather
3. Send `/newbot` command
4. Follow the prompts to choose a name and username for your bot
5. BotFather will provide you with a **bot token** - save this securely

### Step 2: Get Your Chat ID

1. Start a conversation with your newly created bot
2. Send any message to the bot
3. Open this URL in your browser (replace `YOUR_BOT_TOKEN` with your actual bot token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Look for the `chat` object in the response and note the `id` value - this is your **chat ID**

### Step 3: Configure the Website

1. Open `telegram-contact.js` file
2. Replace `YOUR_TELEGRAM_BOT_TOKEN_HERE` with your actual bot token
3. Replace `YOUR_CHAT_ID_HERE` with your actual chat ID

Example:
```javascript
this.botToken = '1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ123456789';
this.chatId = '1234567890';
```

### Step 4: Test the Integration

1. Open your website
2. Navigate to the Contact section
3. Fill out and submit the contact form
4. Check your Telegram chat for the message

## Message Format

When someone submits the contact form, you'll receive a formatted message in Telegram:

```
🔔 New Contact Form Submission

📅 Date: [timestamp]
👤 Name: [name]
📧 Email: [email]
💬 Message:
[message content]

---
Sent from: Oladoye Author Website
```

## Error Handling

The system includes comprehensive error handling:

- **Configuration errors**: User-friendly messages when bot is not configured
- **Network errors**: Graceful handling of API failures
- **Validation errors**: Client-side form validation
- **Success feedback**: Clear confirmation when messages are sent

## Security Notes

⚠️ **Important Security Considerations:**

- The current implementation stores bot credentials in client-side JavaScript
- For production use, consider implementing a backend service to handle Telegram API calls
- Store sensitive credentials as environment variables
- Regularly rotate your bot token for security

## File Structure

```
├── index.html              # Main website HTML
├── style.css              # Website styling
├── script.js              # Main website JavaScript
├── telegram-contact.js    # Telegram bot integration
└── README.md             # This file
```

## Customization

### Styling
The contact form status messages use CSS classes:
- `.status-success` - Green styling for success messages
- `.status-error` - Red styling for error messages  
- `.status-loading` - Yellow styling for loading states

### Message Format
To customize the Telegram message format, edit the `_formatMessage()` method in `telegram-contact.js`.

## Support

For issues or questions:
- Email: oladoyejoel3@gmail.com
- Check browser console for debugging information
- Ensure your bot token and chat ID are correctly configured