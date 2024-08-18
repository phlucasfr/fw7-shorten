import express from 'express';
import { json } from 'body-parser';
import { urlRouter } from './controllers/urlController';
import { rateLimiter } from './middleware/rateLimiter';
import { connectRedis, disconnectRedis } from './config/redis';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(json());
app.use(rateLimiter);
app.use('/api/urls', urlRouter);

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectRedis(); 
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    process.exit(1);
  }
};

const stopServer = async () => {
  try {
    await disconnectRedis();
  } catch (error) {
    console.error('Error disconnecting from Redis:', error);
  }
};

process.on('SIGINT', async () => {
  await stopServer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopServer();
  process.exit(0);
});

startServer();
