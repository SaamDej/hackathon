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

const fetchYoutubeLink = async (songTitle, artist) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error("YouTube API Key is missing in .env");
    return null;
  }

  const query = encodeURIComponent(`${songTitle} ${artist} official video`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=1&type=video`;

  console.log(`Fetching YouTube link for: ${songTitle} - ${artist}`);
  console.log(`Request URL: ${url}`);

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("YouTube API Response:", JSON.stringify(data, null, 2));

    if (!data.items || data.items.length === 0) {
      console.error("No videos found for:", songTitle, artist);
      return null;
    }

    return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
  } catch (error) {
    console.error("Error fetching YouTube link:", error);
    return null;
  }
};

app.post('/api/get-songs', async (req, res) => {
  const { emotion } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: 'Emotion is required' });
  }

  try {
    console.log('Fetching songs for emotion:', emotion);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a music recommendation assistant. Based on the user’s emotion, suggest 5 completely different songs each time. Ensure diversity by randomly selecting from a large database of songs. Format response as a JSON array with "title" and "artist". No other text.',
        },
        {
          role: 'user',
          content: `User emotion: ${emotion}`,
        },
      ],
      model: 'deepseek-chat',
      max_tokens: 300
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('Invalid response from DeepSeek API');
    }

    let songs = completion.choices[0].message?.content;

    if (songs.startsWith('```json') && songs.endsWith('```')) {
      songs = songs.slice(7, -3).trim();
    }

    const parsedSongs = JSON.parse(songs);

    const songsWithYoutubeLinks = await Promise.all(
      parsedSongs.map(async (song) => ({
        ...song,
        youtubeUrl: await fetchYoutubeLink(song.title, song.artist),
      }))
    );
    res.json({ emotion, songs: songsWithYoutubeLinks });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Error processing your request' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
