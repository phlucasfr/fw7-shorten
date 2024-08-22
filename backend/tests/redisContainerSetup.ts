
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { createClient, RedisClientType } from 'redis';

let redisContainer: StartedRedisContainer;
let redisClient: RedisClientType;

export const setupRedis = async (): Promise<void> => {
  redisContainer = await new RedisContainer().start();
  redisClient = createClient({
    url: redisContainer.getConnectionUrl(),
  });
  await redisClient.connect();
};

export const teardownRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
  }
  if (redisContainer) {
    await redisContainer.stop();
  }
};

export const getRedisClient = (): RedisClientType => redisClient;
