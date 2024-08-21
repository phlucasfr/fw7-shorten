import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

client.on('error', (err) => {
  console.error('Erro ao conectar ao Redis:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

export const connectRedis = async () => {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (err) {
      console.error('Erro ao conectar ao Redis:', err);
    }
  }
};

export const disconnectRedis = async () => {
  if (client.isOpen) {
    try {
      await client.quit();
    } catch (err) {
      console.error('Erro ao desconectar do Redis:', err);
    }
  }
};

export default client;
