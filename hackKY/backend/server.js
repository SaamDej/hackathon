import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

app.post('/api/get-songs', async (req, res) => {
  const { emotion } = req.body;

  console.log('Received request for this emotion', emotion);

  if (!emotion) {
    console.error('emotion is missing');
    return res.status(400).json({ error: 'Emotion is required' });
  }

  try {
    console.log('Calling DeepSeek API for song recommendations...');

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a music recommendation assistant. Based on the user’s emotion, suggest 5 **completely different** songs **each time** the request is made. Ensure diversity by randomly selecting from a large database of songs. Do not repeat previous suggestions. Format your response as a JSON array with each song containing "title" and "artist". Do not include any other text.',
        },
        {
          role: 'user',
          content: `User emotion: ${emotion}`,
        },
      ],
      model: 'deepseek-chat',
      max_tokens: 300
    });

    console.log('DeepSeek API response:', JSON.stringify(completion, null, 2));

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('Invalid response from DeepSeek API');
    }

    let songs = completion.choices[0].message?.content;

    if (songs && songs.startsWith('```json') && songs.endsWith('```')) {
      songs = songs.slice(7, -3).trim();
    }

    const parsedSongs = JSON.parse(songs);

    console.log('Parsed song data:', parsedSongs);

    res.json({ emotion, songs: parsedSongs });
  } catch (error) {
    console.error('Error calling DeepSeek API:', error.message);
    res.status(500).json({ error: 'Error processing your request' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
