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
// Normalize the configured origin so trailing slashes don't break equality checks
const allowedOrigin =
  (process.env.FRONTEND_ORIGIN && process.env.FRONTEND_ORIGIN.replace(/\/$/, '')) ||
  '*';

app.use(
  cors({
    // Use a function so we can safely compare normalized origins and
    // reflect the actual request origin in the CORS header.
    origin(origin, callback) {
      // Allow non-browser / same-origin requests with no Origin header
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (allowedOrigin === '*' || normalizedOrigin === allowedOrigin) {
        // `true` tells `cors` to reflect the request origin
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
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
