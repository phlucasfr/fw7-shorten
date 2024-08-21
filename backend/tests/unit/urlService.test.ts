import { shortenUrlService, getUrlService } from '../../src/services/urlService';
import { saveUrl, getUrl } from '../../src/repositories/urlRepository';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { createClient, RedisClientType } from 'redis';

jest.mock('../../src/repositories/urlRepository');

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

  it('deve encurtar a URL e salvar no banco de dados', async () => {
    const originalUrl = 'http://exampletest.com';
    
    (saveUrl as jest.Mock).mockResolvedValue(undefined);    
    (getUrl as jest.Mock).mockResolvedValue(originalUrl);

    const result = await shortenUrlService(originalUrl, 100);

    expect(saveUrl).toHaveBeenCalledWith({originalUrl: originalUrl, shortId: result.shortId});
    
    const gettedUrl = await getUrlService(result.shortUrl);
    expect(gettedUrl).toBe(originalUrl);
  });

  it('deve retornar a URL original', async () => {
    const originalUrl = 'http://exampletest2.com';
    (saveUrl as jest.Mock).mockResolvedValue(undefined);
    (getUrl as jest.Mock).mockResolvedValue(originalUrl);

    const result = await shortenUrlService(originalUrl, 100);
    const gettedUrl = await getUrlService(result.shortUrl);
    expect(gettedUrl).toBe(originalUrl);
  });

  it('deve retornar null para um shortId não encontrado', async () => {
    const shortId = 'nonexistentId';

    (getUrl as jest.Mock).mockResolvedValue(null);

    const result = await getUrlService(shortId);
    expect(result).toBeNull();
  });

  it('deve tratar entradas maliciosas no retrieveUrl', async () => {
    const sqlInjectionAttempt = "' OR '1'='1";

    (getUrl as jest.Mock).mockResolvedValue(null);

    const result = await getUrlService(sqlInjectionAttempt);
    expect(result).toBeNull();
  });
});
