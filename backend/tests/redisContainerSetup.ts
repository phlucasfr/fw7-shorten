
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { createClient, RedisClientType } from 'redis';

let redisContainer: StartedRedisContainer;
let redisClient: RedisClientType;

export const setupRedis = async (): Promise<void> => {
  jest.setTimeout(10000);
  redisContainer = await new RedisContainer().start();
  redisClient = createClient({
    url: redisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
};

const teardownRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
  }
  if (redisContainer) {
    await redisContainer.stop();
  }
};

beforeAll(async () => {
  await setupRedis();
});

afterAll(async () => {
  await teardownRedis(); 
});

export const getRedisClient = (): RedisClientType => redisClient;
