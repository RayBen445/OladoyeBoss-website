# Oladoye Author and Kingdom Voice Website

# Faithjesus Oladoye - Author & Kingdom Voice Website

A personal website for Faithjesus Oladoye featuring blog posts, book store, video store, AI chat functionality, and contact functionality with Telegram bot integration.

## Features

### Multi-Page Architecture
- **Home**: Welcome introduction with hero section and overview
- **About**: Personal story, mission, credentials, and statistics
- **Blog**: Organized blog posts with categories and metadata
- **Books**: Professional book showcase with detailed information
- **Videos**: Video library with filtering and categorization
- **AI Chat**: Interactive AI assistant for spiritual guidance
- **Contact**: Enhanced contact form with Telegram integration

### Logo Integration
The website includes a video logo in the header that displays across all pages:

#### Adding Your Logo
1. **Video Format**: The logo should be in `.webm` format for best compatibility
2. **File Name**: Save your logo video as `logo.webm` in the root directory
3. **Recommended Specifications**:
   - Format: WebM (VP8/VP9 codec)
   - Duration: 2-5 seconds (loops automatically)
   - Resolution: 200x200px or square aspect ratio
   - Size: Keep under 1MB for fast loading
   - Audio: Muted (audio is disabled by default)

#### Current Logo Setup
- **File**: `logo.webm` (place your logo file here)
- **Source URL**: https://files.catbox.moe/flmgyo.webm (your provided logo)
- **Display**: 60px circle in header with auto-play, loop, and muted
- **Fallback**: Text-based logo if video fails to load

To update the logo:
1. Download your logo from the provided URL
2. Convert to WebM format if needed
3. Save as `logo.webm` in the website root directory
4. Deploy to your hosting service

### AI Chat Integration
- **Google AI (Gemini) Integration**: Professional AI chat system for spiritual guidance
- **Setup**: Set `GOOGLE_AI_API_KEY` environment variable in your deployment platform
- **Features**: Conversation history, suggested questions, responsive design

### Telegram Bot Integration
- **Bot Token**: `8113980847:AAELB5KE3IGxJ4BON7wG6h7_Qs1oPy_sOto`
- **Chat ID**: `593933293`
- **Functionality**: Contact form submissions are automatically sent to Telegram

## Deployment Instructions

### For Vercel (Recommended)
1. Upload all files including `logo.webm` to your repository
2. Connect repository to Vercel
3. Set environment variable: `GOOGLE_AI_API_KEY` with your Google AI API key
4. Deploy

### For Other Hosting Platforms
1. Upload all files to your web server
2. Ensure `logo.webm` is in the root directory alongside `index.html`
3. Configure environment variables for AI chat functionality

## Technical Requirements
- Modern web browser with HTML5 video support
- WebM video codec support
- JavaScript enabled for interactive features

## File Structure
```
├── index.html          # Homepage
├── about.html          # About page
├── blog.html           # Blog page
├── books.html          # Books showcase
├── videos.html         # Video library
├── chat.html           # AI Chat page
├── contact.html        # Contact form
├── style.css           # Main stylesheet
├── script.js           # Main JavaScript
├── ai-chat.js          # AI Chat functionality
├── telegram-contact.js # Telegram bot integration
├── logo.webm          # Video logo (add your file here)
└── README.md          # This file
```

## Logo Troubleshooting

If the logo doesn't appear:
1. **Check file name**: Ensure it's exactly `logo.webm`
2. **Check file format**: Must be WebM format
3. **Check file size**: Large files may not load quickly
4. **Check browser support**: Ensure WebM is supported
5. **Fallback**: Text logo will display if video fails

The logo integration includes automatic fallback to text-based branding if the video fails to load, ensuring the website always looks professional.

## Customization

### Logo Styling
The logo appearance can be customized in `style.css`:
- Size: Modify `.logo-container` width/height
- Position: Adjust `.header-content` layout
- Border: Change `.logo-container` border properties
- Animation: Add CSS animations to `.logo-video`

### Colors & Branding
The website uses a sky blue to dark blue gradient theme that can be customized via CSS custom properties in `style.css`.

For support or questions, contact Faithjesus Oladoye through the website's contact form.

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