import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDb } from './db.js';
import countdownRoutes from './routes/countdown.js';
import highscoresRoutes from './routes/highscores.js';
import askRoutes from './routes/ask.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Birthday site API is running.' });
});

app.use('/api/countdown', countdownRoutes);
app.use('/api/highscores', highscoresRoutes);
app.use('/api/ask', askRoutes);

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });