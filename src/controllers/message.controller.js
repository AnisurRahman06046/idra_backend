import { channel } from '../config/rabbit.js';

export const sendMessage = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    await channel.sendToQueue('messages', Buffer.from(message));
    res.json({ success: true, message: 'Message sent to queue' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message', details: err.message });
  }
};
