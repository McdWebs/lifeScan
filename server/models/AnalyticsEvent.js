import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sessionId: {
      type: String,
      required: false,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    route: {
      type: String,
      required: false,
      trim: true,
    },
    source: {
      type: String,
      required: false,
      trim: true,
      default: 'client',
      index: true,
    },
    properties: {
      type: Object,
      default: {},
    },
    userAgent: {
      type: String,
      required: false,
    },
    ip: {
      type: String,
      required: false,
    },
    version: {
      type: String,
      required: false,
      trim: true,
    },
    isError: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false },
  }
);

analyticsEventSchema.index({ timestamp: -1 });
analyticsEventSchema.index({ userId: 1, timestamp: -1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

export default AnalyticsEvent;

