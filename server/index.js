import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import checklistRoutes from './routes/checklist.js';
import historyRoutes from './routes/history.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import feedbackRoutes from './routes/feedback.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/checklist', checklistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/feedback', feedbackRoutes);

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  server.timeout = 90000; // 90s — allows time for AI generation
});
