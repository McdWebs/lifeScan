import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name?.trim() || '', email, password: hashedPassword });

    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ── Google OAuth: start flow ────────────────────────────────────────────────────
router.get('/google', (req, res) => {
  try {

    const redirect = typeof req.query.redirect === 'string' ? req.query.redirect : '/home';
    const state = encodeURIComponent(redirect);

    const url = googleClient.generateAuthUrl({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      access_type: 'offline',
      prompt: 'consent',
      scope: ['openid', 'email', 'profile'],
      state,
    });

    res.redirect(url);
  } catch (error) {
    console.error('Error starting Google OAuth', error);
    res.status(500).send('Failed to start Google sign-in.');
  }
});

// ── Google OAuth: callback ──────────────────────────────────────────────────────
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res.status(400).send('Missing authorization code.');
    }

    const redirectPath = state ? decodeURIComponent(state) : '/home';

    // Exchange code for tokens explicitly to ensure client_id/secret are sent
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code.toString(),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenJson = await tokenResp.json();
    if (!tokenResp.ok) {
      console.error('Google token error:', tokenJson);
      return res.status(500).send('Authentication failed.');
    }

    const idToken = tokenJson.id_token;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const name = payload.name || '';

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        // password is optional for Google accounts
      });
    }

    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const frontendBase = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    const redirectUrl = new URL(redirectPath, frontendBase);

    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('id', user._id.toString());
    redirectUrl.searchParams.set('name', user.name || '');
    redirectUrl.searchParams.set('email', user.email);

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Google OAuth callback error', error);
    res.status(500).send('Authentication failed.');
  }
});

export default router;
