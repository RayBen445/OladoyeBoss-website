# Real-time Selar and YouTube Integration Setup Guide

This guide will help you configure real-time integration with Selar (for books) and YouTube (for videos) on your Oladoye Author website.

## Overview

The website now includes:
- **Selar Integration**: Receives webhook notifications when new books are added to your Selar store
- **YouTube Integration**: Polls your YouTube channel for new video uploads
- **Real-time Updates**: Frontend automatically refreshes to show new content
- **Homepage Features**: Latest books and videos are displayed on the homepage

## Environment Variables

Set these environment variables in your deployment platform:

### Required for YouTube Integration
```bash
YOUTUBE_API_KEY=your_youtube_data_api_v3_key_here
```

### Required for Selar Webhook Security (Recommended)
```bash
SELAR_WEBHOOK_SECRET=your_secure_webhook_secret_here
```

### Optional (Already configured)
```bash
GOOGLE_AI_API_KEY=your_google_ai_key_here  # For AI chat feature
```

## YouTube API Setup

### 1. Get YouTube Data API v3 Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Copy the API key and set it as `YOUTUBE_API_KEY` environment variable

### 2. YouTube Channel Configuration

The system is pre-configured for channel ID: `UC19PIBr_7lYBWWgJfPSzODA`

To change the channel:
1. Edit `/data/config.json` and update the `channelId`
2. Or modify `/api/youtube.js` and change the `YOUTUBE_CHANNEL_ID` constant

### 3. YouTube Polling

- **Automatic**: Polls every 5 minutes when visitors are on the site
- **Manual**: POST request to `/api/youtube` to trigger immediate polling
- **Data Storage**: New videos are stored in `/data/videos.json`

## Selar Integration Setup

### 1. Configure Webhook Secret

1. Set a secure webhook secret:
   ```bash
   SELAR_WEBHOOK_SECRET=your_very_secure_random_string_here
   ```
2. Use a strong, randomly generated string (at least 32 characters)

### 2. Selar Webhook Configuration

In your Selar dashboard:

1. Go to your store settings
2. Find "Webhooks" or "Notifications" section
3. Add a new webhook with these settings:
   - **URL**: `https://yourdomain.com/api/selar-webhook`
   - **Events**: Select "Product Created" and "Product Updated"
   - **Secret**: Use the same secret as your `SELAR_WEBHOOK_SECRET`

### 3. Webhook Events

The system handles these Selar events:
- `product.created` - When a new book/product is added
- `product.updated` - When an existing book/product is modified

### 4. Data Storage

New books are automatically stored in `/data/books.json` and appear immediately on:
- Homepage (Latest Books section)
- Books page (real-time updates)

## API Endpoints

### Books API
- `GET /api/books` - Get all books
- Response includes: books array, last updated timestamp, count

### Videos API  
- `GET /api/videos` - Get all videos
- `GET /api/videos?category=sermons` - Get videos by category
- `GET /api/videos?limit=5` - Limit number of results

### YouTube Polling
- `GET /api/youtube` - Get polling status and configuration
- `POST /api/youtube` - Manually trigger YouTube polling

### Selar Webhook
- `POST /api/selar-webhook` - Receive Selar webhook notifications
- Requires valid signature if `SELAR_WEBHOOK_SECRET` is configured

## Real-time Features

### Frontend Polling
- **Books**: Checks for updates every 30 seconds
- **Videos**: Checks for updates every 60 seconds
- **Smart Polling**: Pauses when browser tab is not visible
- **Notifications**: Shows toast notifications for new content

### Auto-refresh Behavior
1. User visits books or videos page
2. JavaScript loads initial content from API
3. Starts polling for updates in background
4. When new content is detected, shows notification and updates display
5. Polling stops when user leaves page or tab becomes inactive

## Deployment Instructions

### For Vercel (Recommended)

1. **Push your code** to GitHub
2. **Connect to Vercel** and import your repository
3. **Set environment variables** in Vercel dashboard:
   - `YOUTUBE_API_KEY`
   - `SELAR_WEBHOOK_SECRET`
   - `GOOGLE_AI_API_KEY` (optional)
4. **Deploy** - All API endpoints will be available automatically

### For Other Platforms

1. **Upload all files** to your hosting platform
2. **Ensure Node.js support** (version 14+ required)
3. **Set environment variables** in your platform's settings
4. **Configure server** to serve static files and handle API routes
5. **Test endpoints** to ensure they're accessible

## Testing the Integration

### Test Selar Webhook

```bash
curl -X POST https://yourdomain.com/api/selar-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "product.created",
    "data": {
      "id": "test-123",
      "name": "Test Book",
      "description": "A test book",
      "price": "19.99",
      "currency": "USD",
      "image_url": "https://example.com/book.jpg",
      "url": "https://selar.com/m/OladoyeStore/test-book"
    }
  }'
```

### Test YouTube Polling

```bash
# Check status
curl https://yourdomain.com/api/youtube

# Trigger manual poll
curl -X POST https://yourdomain.com/api/youtube
```

### Test APIs

```bash
# Get books
curl https://yourdomain.com/api/books

# Get videos
curl https://yourdomain.com/api/videos

# Get videos by category
curl https://yourdomain.com/api/videos?category=sermons
```

## Troubleshooting

### YouTube API Issues
- **Error 403**: Check API key is valid and YouTube Data API v3 is enabled
- **Error 404**: Verify channel ID is correct
- **No videos**: Check channel has public videos

### Selar Webhook Issues
- **Webhook not received**: Check URL and firewall settings
- **Invalid signature**: Verify webhook secret matches
- **Missing data**: Check Selar webhook configuration

### Frontend Issues
- **No real-time updates**: Check browser console for JavaScript errors
- **API errors**: Verify environment variables are set correctly
- **Loading issues**: Check network tab for failed API requests

## File Structure

```
/api/
  ├── books.js          # Books API endpoint
  ├── videos.js         # Videos API endpoint  
  ├── youtube.js        # YouTube polling endpoint
  ├── selar-webhook.js  # Selar webhook endpoint
  └── chat.js          # AI chat endpoint (existing)

/data/
  ├── books.json       # Books data storage
  ├── videos.json      # Videos data storage
  └── config.json      # Configuration settings

Frontend JavaScript:
  ├── book-store.js      # Books page functionality
  ├── video-store.js     # Videos page functionality
  └── homepage-features.js # Homepage featured content
```

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Webhook Security**: Always use webhook secrets for production
3. **Rate Limiting**: YouTube API has quota limits - polling is set conservatively
4. **Input Validation**: All webhook data is validated before processing
5. **CORS**: APIs are configured for proper cross-origin requests

## Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify environment variables are set correctly
3. Test API endpoints directly with curl
4. Check server logs for detailed error messages
5. Ensure all dependencies are properly installed

The integration is designed to be resilient - if YouTube API is unavailable or Selar webhooks fail, the site continues to function normally with existing content.