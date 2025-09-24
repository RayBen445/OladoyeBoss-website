# AI Chat Deployment Guide

## Quick Setup (Recommended)

### For Vercel Deployment:
1. **Get Google AI API Key**: Visit [https://ai.google.dev/](https://ai.google.dev/) and create an API key
2. **Set Environment Variable**: In your Vercel project dashboard:
   - Go to Settings → Environment Variables
   - Add: `GOOGLE_AI_API_KEY` = `your_actual_api_key_here`
3. **Deploy**: The `/api/chat` endpoint will automatically work

### For Other Platforms (Netlify, etc.):
1. Set the environment variable `GOOGLE_AI_API_KEY` in your deployment platform
2. Ensure your platform supports serverless functions or Node.js backend
3. The API endpoint should be accessible at `/api/chat`

## How It Works

- **Frontend**: `ai-chat.js` attempts to use `/api/chat` backend endpoint first
- **Backend**: `api/chat.js` securely handles Google AI API calls with server-side API key
- **Fallback**: Shows configuration banner if backend is not available
- **Security**: API key is never exposed to the client browser

## Testing

1. Navigate to `/chat.html`
2. If properly configured, the warning banner should disappear
3. Try the suggested questions or type your own message
4. Verify responses are being generated properly

## Troubleshooting

### Banner Still Showing
- Check that `GOOGLE_AI_API_KEY` environment variable is set
- Verify the API key is valid
- Ensure `/api/chat` endpoint is accessible

### Error Messages
- Check browser console for detailed error information
- Verify Google AI API quotas and billing
- Ensure CORS is properly configured if using custom backend

## Local Development

For local testing only:
1. Copy `ai-config.example.js` to `ai-config.js`
2. Add your API key to the file
3. Include the script in `chat.html` (remember to remove for production)

**⚠️ Never commit API keys to version control!**