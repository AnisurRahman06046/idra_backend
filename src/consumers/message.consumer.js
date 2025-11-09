import Message from '../models/message.model.js';
import { channel } from '../config/rabbit.js';

export const startConsumer = async () => {
  if (!channel) return;

  channel.consume('messages', async (msg) => {
    if (msg) {
      const text = msg.content.toString();
      console.log('📥 Consumed:', text);

      // Save to MongoDB
      await Message.create({ text });

      channel.ack(msg);
    }
  });
};
