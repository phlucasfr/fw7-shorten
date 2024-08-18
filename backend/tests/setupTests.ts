import client from '../src/config/redis';

beforeAll(async () => {
  if (!client.isOpen) {
    await client.connect();
  }
});

afterAll(async () => {
  if (client.isOpen) {
    await client.quit();
  }
});
