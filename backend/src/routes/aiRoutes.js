import express from 'express';
import { fetchStudyResponse } from '../api/gemini.js';

const router = express.Router();

router.post('/ask-ai', async (req, res) => {
    const { prompt } = req.body;
    const result = await fetchStudyResponse(prompt);
    res.json({ result });
});

export default router;