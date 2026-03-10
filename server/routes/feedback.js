import { Router } from 'express';
import { Resend } from 'resend';

const router = Router();

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set in the environment');
  }
  return new Resend(apiKey);
}
const FEEDBACK_TO = 'michaelwork1010@gmail.com';

router.post('/', async (req, res) => {
  try {
    const { name = '', email = '', subject = '', message = '' } = req.body || {};

    if (!message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const safeName = name.trim() || 'Anonymous user';
    const safeEmail = email.trim() || 'not provided';
    const safeSubject = subject.trim() || 'New feedback from LifeScan';

    const textBody = [
      `New feedback submitted from LifeScan:`,
      '',
      `Name: ${safeName}`,
      `Email: ${safeEmail}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const resend = getResend();
    const { error } = await resend.emails.send({
      from: 'LifeScan Feedback <onboarding@resend.dev>',
      to: FEEDBACK_TO,
      subject: safeSubject,
      text: textBody,
    });

    if (error) {
      console.error('Resend error sending feedback email:', error);
      return res.status(500).json({ error: 'Failed to send feedback. Please try again later.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Unexpected error in feedback route:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

export default router;

