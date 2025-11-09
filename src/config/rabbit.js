import amqp from 'amqplib';

let channel;

export async function connectRabbit() {
  const conn = await amqp.connect(process.env.RABBIT_URL);
  channel = await conn.createChannel();
  await channel.assertQueue('messages');
  console.log('✅ RabbitMQ connected');
  return channel;
}

export { channel };
