import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db.js';
import checklistRoutes from './routes/checklist.js';
import historyRoutes from './routes/history.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import feedbackRoutes from './routes/feedback.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Global security middleware ────────────────────────────────────────────────

// Standard HTTP security headers (X-Frame-Options, X-Content-Type-Options, etc.)
app.use(helmet());

// Restrict CORS in production; fall back to permissive in local dev
const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

app.use('/api/checklist', checklistRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  server.timeout = 90000; // 90s — allows time for AI generation
});
