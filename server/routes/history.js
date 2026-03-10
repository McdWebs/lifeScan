import { Router } from 'express';
import Checklist from '../models/Checklist.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;

    const filter = {};
    if (req.userId) {
      filter.userId = req.userId;
    } else if (sessionId) {
      filter.sessionId = sessionId;
    } else {
      return res.json([]);
    }

    const checklists = await Checklist.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const results = checklists.map((checklist) => {
      const total = checklist.tasks.length;
      const completed = checklist.tasks.filter((t) => t.completed).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...checklist, progress };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
