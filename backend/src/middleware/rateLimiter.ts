import { Request, Response, NextFunction } from 'express';
import client from '../config/redis';

const LIMIT: number = 100;
const SECONDS_IN_A_DAY: number = 24 * 60 * 60;

const getTodayKey = (ip: string) => `rate_limit:${ip}:${new Date().toISOString().split('T')[0]}`;

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && req.path.startsWith('/api/urls/shorten')) {
    const ip: string | undefined = req.ip;
    if (!ip) {
      return res.status(500).json({ error: 'IP address not found' });
    }
    const key: string = getTodayKey(ip);
    const requests: string | null = await client.get(key);

    if (requests && parseInt(requests) >= LIMIT) {
      return res.status(429).json({
        error: 'Você atingiu o limite de encurtamentos de URL. Tente novamente amanhã.',
        remaining: 0,
      });
    }

    res.on('finish', async () => {
      if (res.statusCode === 201) {
        if (requests) {
          await client.incr(key);
        } else {
          await client.set(key, '1', {
            EX: SECONDS_IN_A_DAY,
          });
        }
      }
    });

    (req as any).remainingUrls = LIMIT - (requests ? parseInt(requests) : 0);
    next();
  } else {
    next();
  }
};
