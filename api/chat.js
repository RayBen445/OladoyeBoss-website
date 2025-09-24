/**
 * Vercel Serverless Function for AI Chat
 * 
 * This function acts as a secure backend proxy for the Google AI Gemini API.
 * It keeps the API key secure on the server side and handles CORS.
 * 
 * Environment Variables Required:
 * - GOOGLE_AI_API_KEY: Your Google AI API key from https://ai.google.dev/
 */

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        console.error('GOOGLE_AI_API_KEY environment variable not set');
        return res.status(500).json({ 
            error: 'API configuration error',
            message: 'Please contact the administrator to configure the Google AI API key.'
        });
    }

    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required and must be a string' });
        }

        // Build the system prompt
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

        // Prepare the request body for Google AI
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
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1000,
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

        // Make request to Google AI API
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google AI API Error:', errorData);
            
            // Return user-friendly error message
            return res.status(response.status).json({
                error: 'AI service error',
                message: 'Sorry, I encountered an error while processing your request. Please try again later.',
                details: process.env.NODE_ENV === 'development' ? errorData : undefined
            });
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            return res.status(500).json({
                error: 'No response from AI',
                message: 'I apologize, but I couldn\'t generate a response. Please try rephrasing your question.'
            });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        // Return successful response
        return res.status(200).json({
            success: true,
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in chat API:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}