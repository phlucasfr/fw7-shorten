import client from '../config/redis';

interface UrlRecord {
  originalUrl: string;
  shortId: string;
}

export const saveUrl = async ({ originalUrl, shortId }: UrlRecord): Promise<void> => {
  await client.set(`url:${shortId}`, originalUrl);
};

export const getUrl = async (shortId: string): Promise<string | null> => {
  return await client.get(`url:${shortId}`);
};
