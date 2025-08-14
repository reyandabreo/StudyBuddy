import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Check if the API key is present and throw a clear error if not
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in your environment variables.');
}

export async function fetchStudyResponse(userPrompt) {
    const formattedPrompt = `
        Give a study-oriented response to this prompt: "${userPrompt}" in the following format:
        1. Overview (easy to understand)
        2. Real-life Examples
        3. Technical Examples
        4. Flowchart or Diagram (in Mermaid syntax)
        5. Comparison table or bullet points
    `;

    const payload = {
        contents: [{ parts: [{ text: formattedPrompt }] }],
    };

    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            payload,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        return (
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response received"
        );
    } catch (error) {
        console.error('Gemini API error:', error?.response?.data || error.message);
        return "Failed to fetch response from Gemini";
    }
}