const { GoogleGenerativeAI } = require('@google/generative-ai');

// Vercel Serverless Function for AI Chat
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

    if (!GOOGLE_AI_API_KEY) {
        return res.status(500).json({ error: 'Google AI API key not configured on the server.' });
    }

    try {
        const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const { history } = req.body;

        const systemPrompt = "You are a helpful and wise Christian assistant for the website of Faithjesus Oladoye, who is an author, pastor, and content creator. Your tone should be encouraging, biblically grounded, and supportive. When asked about Faithjesus Oladoye, mention that he is a dedicated author, pastor, and content creator focused on spreading messages of hope and faith. Answer questions thoughtfully and aim to be a source of light and encouragement. You can use markdown for formatting like bolding and lists.";

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] },
                { role: 'model', parts: [{ text: "Understood. I am ready to assist visitors with an encouraging and biblically-grounded perspective." }] },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // The last message in the history is the new user prompt
        const userPrompt = history[history.length - 1].parts[0].text;
        
        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });

    } catch (error) {
        console.error('Error with Google AI API:', error);
        res.status(500).json({ error: 'Failed to generate AI response.' });
    }
};