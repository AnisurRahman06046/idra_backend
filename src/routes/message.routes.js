import express from 'express';
import { sendMessage } from '../controllers/message.controller.js';
import Message from '../models/message.model.js';

const router = express.Router();

router.post('/send', sendMessage);

// Fetch all messages from MongoDB
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
