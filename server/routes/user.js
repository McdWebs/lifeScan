import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Checklist from '../models/Checklist.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();
router.use(authMiddleware);

// GET /api/user/me — return current profile
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -tokenVersion');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/user/profile — update display name
router.patch('/profile', async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name: name?.trim() ?? '' },
      { new: true, select: '-password -tokenVersion' }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/user/password — change password
router.patch('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.tokenVersion += 1;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/user/invalidate-sessions — sign out all other devices
router.post('/invalidate-sessions', async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Password is incorrect' });

    user.tokenVersion += 1;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/export — download all user data as JSON
router.get('/export', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -tokenVersion');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const checklists = await Checklist.find({ userId: req.userId }).lean();

    const exportData = {
      exportedAt: new Date().toISOString(),
      account: { name: user.name, email: user.email, memberSince: user.createdAt },
      checklists: checklists.map((c) => ({
        id: c._id,
        eventType: c.eventType,
        answers: c.answers,
        createdAt: c.createdAt,
        tasks: c.tasks.map((t) => ({
          title: t.title,
          description: t.description,
          category: t.category,
          completed: t.completed,
          completedAt: t.completedAt,
        })),
      })),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="LifeScan-data.json"');
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/user/account — permanently delete account and all data
router.delete('/account', async (req, res) => {
  try {
    const { currentPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ error: 'Password is required to delete your account' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Password is incorrect' });

    await Checklist.deleteMany({ userId: req.userId });
    await User.findByIdAndDelete(req.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
