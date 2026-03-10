import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    affiliateCategory: { type: String, default: null },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { _id: false }
);

const checklistSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    eventType: { type: String, required: true },
    answers: { type: Object },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

const Checklist = mongoose.model('Checklist', checklistSchema);

export default Checklist;
