import { RedisClientType } from 'redis';
import URLParse from 'url-parse';
import { setupRedis, getRedisClient } from '../redisContainerSetup';

describe('Url Service', () => {
  let redisClient: RedisClientType;

  beforeAll(async () => {
    await setupRedis();
    redisClient = getRedisClient();
  });

  const generateShortId = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };

  const saveUrl = async ({ originalUrl, shortId }: { originalUrl: string; shortId: string }): Promise<void> => {
    await redisClient.set(`url:${shortId}`, originalUrl);
  };

  const getUrl = async (shortId: string): Promise<string | null> => {
    return await redisClient.get(`url:${shortId}`);
  };

  const shortenUrlService = async (originalUrl: string, remainingUrls: number): Promise<{ shortUrl: string; remaining: number; shortId: string }> => {
    const shortId = generateShortId();

    const parsedUrl = new URLParse(originalUrl, {});

    if (!parsedUrl.protocol) {
      parsedUrl.set('protocol', 'https:');
    }

    if (!parsedUrl.hostname.startsWith('www.')) {
      parsedUrl.set('hostname', `www.${parsedUrl.hostname}`);
    }

    const formattedUrl = parsedUrl.toString();

    await saveUrl({ originalUrl: formattedUrl, shortId });
    return {
      shortUrl: `https://fw7-shrt.vercel.app/${shortId}`,
      remaining: remainingUrls - 1,
      shortId,
    };
  };

  const getUrlService = async (shortId: string): Promise<string | null> => {
    return await getUrl(shortId);
  };

  it('deve encurtar a URL e salvar no banco de dados', async () => {
    const originalUrl = 'exampletest.com';
    const result = await shortenUrlService(originalUrl, 100);

    const savedUrl = await getUrlService(result.shortId);
    expect(savedUrl).toBe(`https://www.${originalUrl}`);
  }, 10000);

  it('deve retornar a URL original', async () => {
    const originalUrl = 'exampletest2.com';
    const result = await shortenUrlService(originalUrl, 100);

    const savedUrl = await getUrlService(result.shortId);
    expect(savedUrl).toBe(`https://www.${originalUrl}`);
  }, 10000);

  it('deve retornar null para um shortId não encontrado', async () => {
    const result = await getUrlService('nonexistentId');
    expect(result).toBeNull();
  }, 10000);

  it('deve tratar entradas maliciosas no retrieveUrl', async () => {
    const sqlInjectionAttempt = "' OR '1'='1";
    const result = await getUrlService(sqlInjectionAttempt);
    expect(result).toBeNull();
  }, 10000);
});
