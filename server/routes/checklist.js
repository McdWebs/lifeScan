import { Router } from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Checklist from '../models/Checklist.js';
import { personalizeChecklist, generateCustomChecklist } from '../services/openai.js';
import authMiddleware from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { eventType, answers, sessionId } = req.body;

    const filePath = path.join(__dirname, '..', 'data', `${eventType}.json`);
    const raw = await readFile(filePath, 'utf-8');
    const baseTasks = JSON.parse(raw).map((t) => ({
      ...t,
      completed: false,
      completedAt: null,
    }));

    const checklist = await Checklist.create({
      sessionId,
      userId: req.userId || null,
      eventType,
      answers,
      tasks: baseTasks,
    });

    res.status(201).json(checklist);

    personalizeChecklist(eventType, answers, baseTasks)
      .then(async (personalizedTasks) => {
        if (personalizedTasks && personalizedTasks !== baseTasks) {
          checklist.tasks = personalizedTasks;
          await checklist.save();
        }
      })
      .catch(() => {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Custom AI-generated checklist — no static JSON, AI creates everything
router.post('/custom', async (req, res) => {
  try {
    const { eventDescription, sessionId, eventName, iconKey } = req.body;
    const trimmed = eventDescription?.trim();
    if (!trimmed || trimmed.length < 20 || !trimmed.includes(' ')) {
      return res.status(400).json({ error: 'Please provide a short sentence describing your situation (at least ~20 characters).' });
    }

    const { eventTitle, tasks } = await generateCustomChecklist(trimmed);

    // User-supplied name takes priority over AI-generated title
    const finalTitle = eventName?.trim() || eventTitle;

    const checklist = await Checklist.create({
      sessionId,
      userId: req.userId || null,
      eventType: 'custom',
      answers: {
        eventDescription: trimmed,
        eventTitle: finalTitle,
        iconKey: iconKey || 'pencil',
      },
      tasks,
    });

    res.status(201).json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/personalized', async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multi-segment routes must be registered before single-segment /:id routes
router.post('/:id/tasks', async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title?.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    checklist.tasks.push({
      title: title.trim(),
      category: category?.trim() || 'Custom',
      description: '',
      affiliateCategory: null,
      completed: false,
      completedAt: null,
    });

    await checklist.save();
    res.status(201).json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/tasks', async (req, res) => {
  try {
    const { taskIndex, completed } = req.body;

    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    if (taskIndex < 0 || taskIndex >= checklist.tasks.length) {
      return res.status(400).json({ error: 'Invalid task index' });
    }

    checklist.tasks[taskIndex].completed = completed;
    checklist.tasks[taskIndex].completedAt = completed ? new Date() : null;
    await checklist.save();

    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id);
    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }
    await checklist.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
