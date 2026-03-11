import { Router } from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import User from '../models/User.js';
import Checklist from '../models/Checklist.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// All analytics routes require authentication so events are tied to a real user when possible
router.use(authMiddleware);

// Ingest a single analytics event
router.post('/event', async (req, res) => {
  try {
    const {
      eventName,
      route,
      sessionId,
      source = 'client',
      properties = {},
      version,
      isError = false,
    } = req.body || {};

    if (!eventName || typeof eventName !== 'string') {
      return res.status(400).json({ error: 'eventName is required' });
    }

    const doc = await AnalyticsEvent.create({
      userId: req.userId || null,
      sessionId: sessionId || null,
      eventName,
      route: route || null,
      source,
      properties,
      version: version || null,
      isError: Boolean(isError),
      userAgent: req.get('user-agent') || null,
      ip: req.ip,
    });

    res.status(201).json({ id: doc._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic overview for the last N days (admin-only)
router.get('/overview', async (req, res) => {
  try {
    const days = Number.parseInt(req.query.days, 10) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalEvents,
      daily,
      topEvents,
      totalUsers,
      newUsers,
      totalChecklists,
      newChecklists,
      pageUsage,
      checklistByEvent,
      openaiUsage,
      todayDau,
      funnelCountsRaw,
    ] = await Promise.all([
      // Exclude admin analytics page activity from aggregate counts
      AnalyticsEvent.countDocuments({
        timestamp: { $gte: since },
        route: { $ne: '/admin/analytics' },
      }),
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            route: { $ne: '/admin/analytics' },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' },
            },
            count: { $sum: 1 },
            users: { $addToSet: '$userId' },
          },
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
              },
            },
            count: 1,
            dau: { $size: '$users' },
            _id: 0,
          },
        },
        { $sort: { date: 1 } },
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            route: { $ne: '/admin/analytics' },
          },
        },
        {
          $group: {
            _id: '$eventName',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 25 },
      ]),
      User.countDocuments({}),
      User.countDocuments({ createdAt: { $gte: since } }),
      Checklist.countDocuments({}),
      Checklist.countDocuments({ createdAt: { $gte: since } }),
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            eventName: 'page_view',
            'properties.page': { $ne: 'admin_analytics' },
          },
        },
        {
          $group: {
            _id: '$properties.page',
            views: { $sum: 1 },
            users: { $addToSet: '$userId' },
          },
        },
        {
          $project: {
            _id: 0,
            page: '$_id',
            views: 1,
            uniqueUsers: { $size: '$users' },
          },
        },
        { $sort: { views: -1 } },
      ]),
      Checklist.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            eventName: {
              $in: [
                'openai_generate_custom_success',
                'openai_generate_custom_error',
                'openai_personalize_success',
                'openai_personalize_error',
              ],
            },
          },
        },
        {
          $group: {
            _id: '$eventName',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: todayStart },
          },
        },
        {
          $group: {
            _id: null,
            users: { $addToSet: '$userId' },
          },
        },
        {
          $project: {
            _id: 0,
            dau: { $size: '$users' },
          },
        },
      ]),
      // Funnel: unique users per step in the period
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            eventName: {
              $in: [
                'signed_in',
                'home_seen',
                'questions_started',
                'checklist_generated',
                'tasks_completed_first_time',
              ],
            },
          },
        },
        {
          $group: {
            _id: { eventName: '$eventName', userId: '$userId' },
          },
        },
        {
          $group: {
            _id: '$_id.eventName',
            users: { $sum: 1 },
          },
        },
      ]),
    ]);

    const funnelOrder = [
      { id: 'signed_in', label: 'Signed in' },
      { id: 'home_seen', label: 'Home page seen' },
      { id: 'questions_started', label: 'Questions started' },
      { id: 'checklist_generated', label: 'Checklist generated' },
      { id: 'tasks_completed_first_time', label: 'First task completed' },
    ];

    const funnelCountsMap = new Map();
    for (const row of funnelCountsRaw) {
      funnelCountsMap.set(row._id, row.users);
    }

    let firstCount = null;
    let prevCount = null;
    const funnel = funnelOrder.map((step) => {
      const users = funnelCountsMap.get(step.id) || 0;
      if (firstCount === null) firstCount = users;

      let conversionFromPrevious = 100;
      let conversionFromFirst = 100;

      if (prevCount !== null && prevCount > 0) {
        conversionFromPrevious = Number(((users / prevCount) * 100).toFixed(1));
      } else if (prevCount !== null && prevCount === 0) {
        conversionFromPrevious = 0;
      }

      if (firstCount > 0) {
        conversionFromFirst = Number(((users / firstCount) * 100).toFixed(1));
      } else {
        conversionFromFirst = 0;
      }

      prevCount = users;

      return {
        step: step.id,
        label: step.label,
        users,
        conversionFromPrevious,
        conversionFromFirst,
      };
    });

    res.json({
      since,
      totalEvents,
      daily,
      topEvents: topEvents.map((e) => ({ eventName: e._id, count: e.count })),
      kpis: {
        totalUsers,
        newUsers,
        totalChecklists,
        newChecklists,
        todayDau: todayDau[0]?.dau ?? 0,
        openaiCalls: openaiUsage.reduce((sum, e) => sum + e.count, 0),
      },
      pages: pageUsage,
      checklistsByEvent: checklistByEvent.map((c) => ({
        eventType: c._id,
        count: c.count,
      })),
      openai: openaiUsage.map((e) => ({
        eventName: e._id,
        count: e.count,
      })),
      funnel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Per-user drilldown
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Number.parseInt(req.query.limit, 10) || 100;

    const events = await AnalyticsEvent.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

