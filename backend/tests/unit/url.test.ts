import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { createClient, RedisClientType } from 'redis';
import URLParse from 'url-parse';

describe('Url Service', () => {
  let redisContainer: StartedRedisContainer;
  let redisClient: RedisClientType;

  beforeAll(async () => {
    jest.setTimeout(60000);
    redisContainer = await new RedisContainer().start();
    redisClient = createClient({
      url: redisContainer.getConnectionUrl(),
    });
    await redisClient.connect();
  }, 60000);

  afterAll(async () => {
    await redisClient.quit();
    await redisContainer.stop();
  }, 60000);

  beforeEach(() => {
    jest.clearAllMocks();
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

    // Adicionar "https://" se não estiver presente
    if (!parsedUrl.protocol) {
      parsedUrl.set('protocol', 'https:');
    }

    // Adicionar "www." se não estiver presente
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
  });

  it('deve retornar a URL original', async () => {
    const originalUrl = 'exampletest2.com';
    const result = await shortenUrlService(originalUrl, 100);

    const savedUrl = await getUrlService(result.shortId);
    expect(savedUrl).toBe(`https://www.${originalUrl}`);
  });

  it('deve retornar null para um shortId não encontrado', async () => {
    const result = await getUrlService('nonexistentId');
    expect(result).toBeNull();
  });

  it('deve tratar entradas maliciosas no retrieveUrl', async () => {
    const sqlInjectionAttempt = "' OR '1'='1";
    const result = await getUrlService(sqlInjectionAttempt);
    expect(result).toBeNull();
  });
});
