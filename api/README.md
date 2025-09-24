# AI Chat Backend Configuration

This directory contains the backend configuration for the AI Chat feature. 

## For Vercel Deployment

To enable the AI Chat feature on Vercel:

1. Add the environment variable in your Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add: `GOOGLE_AI_API_KEY` with your actual Google AI API key

2. The API endpoint will be available at `/api/chat`

## For Other Deployments

Create a simple backend service that:
1. Accepts POST requests to `/api/chat`
2. Forwards requests to Google AI API with your server-side API key
3. Returns the response to the frontend

This ensures the API key is never exposed to clients.