import request from 'supertest';
import express from 'express';
import { setupRedis, getRedisClient } from '../redisContainerSetup';

const shortTermRateLimiter = jest.fn(async (req: any, res: any, next: any) => {
  if (req.method === 'POST' && req.path.startsWith('/api/urls/shorten')) {
    const ip = req.ip || '127.0.0.1';
    const key = `rate_limit:${ip}:${new Date().toISOString().split('T')[0]}`;
    const redisClient = getRedisClient();
    const requests = await redisClient.get(key);

    if (requests && parseInt(requests) >= 10) {
      return res.status(429).json({
        error: 'Você atingiu o limite de encurtamentos de URL. Tente novamente amanhã.',
        remaining: 0,
      });
    }

    res.on('finish', async () => {
      if (res.statusCode === 201) {
        if (requests) {
          await redisClient.incr(key);
        } else {
          await redisClient.set(key, '1', {
            EX: 2,
          });
        }
      }
    });

    (req as any).remainingUrls = 10 - (requests ? parseInt(requests) : 0);
    next();
  } else {
    next();
  }
});

const urlRouter = express.Router();
urlRouter.post('/shorten', (req, res) => {
  res.status(201).json({ shortUrl: 'https://fw7-shrt.vercel.app/shortId', remaining: 9, shortId: 'shortId' });
});

const app = express();
app.use(express.json());
app.use(shortTermRateLimiter);
app.use('/api/urls', urlRouter);

describe('Rate Limiter Integration Tests', () => {
  beforeAll(async () => {
    await setupRedis();
    const redisClient = getRedisClient();
    await redisClient.flushDb();
  });

  it('deve permitir até o limite de requisições', async () => {
    const limit = 10;

    for (let i = 0; i < limit; i++) {
      const response = await request(app)
        .post('/api/urls/shorten')
        .send({ originalUrl: 'example.com' });
      expect(response.status).toBe(201);
    }

    const response = await request(app)
      .post('/api/urls/shorten')
      .send({ originalUrl: 'example.com' });

    expect(response.status).toBe(429);
    expect(response.body.error).toBe('Você atingiu o limite de encurtamentos de URL. Tente novamente amanhã.');
  });

  it('deve permitir requisições após o limite ser alcançado (após expiração)', async () => {
    const limit = 10;

    for (let i = 0; i < limit; i++) {
      await request(app)
        .post('/api/urls/shorten')
        .send({ originalUrl: 'example.com' });
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); 

    const response = await request(app)
      .post('/api/urls/shorten')
      .send({ originalUrl: 'example.com' });

    expect(response.status).toBe(201); 
  });
});
