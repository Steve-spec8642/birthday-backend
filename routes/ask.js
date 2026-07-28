import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a cheerful, playful birthday-themed AI assistant living
on a personal birthday website. Keep responses short (2-4 sentences), warm, and fun.
You can talk about the birthday countdown, the mini-game, or just chat casually.`;

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'message is required.' });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: 'message must be 500 characters or fewer.' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Error calling Gemini API:', err);
    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
});

export default router;