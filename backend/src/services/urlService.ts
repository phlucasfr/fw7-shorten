import { v4 as uuidv4 } from 'uuid';
import { saveUrl, getUrl } from '../repositories/urlRepository';

interface ShortenPayload {
  shortUrl: string;
  remaining: number;
  shortId: string;
}

const generateShortId = (): string => uuidv4().slice(0, 8);

export const shortenUrlService = async (originalUrl: string, remainingUrls: number): Promise<ShortenPayload> => {
  const shortId: string = generateShortId();
  await saveUrl({ originalUrl, shortId });
  return {
    shortUrl: `https://fw7-shorten.onrender.com/api/urls/${shortId}`,
    remaining: remainingUrls - 1,
    shortId,
  };
};

export const getUrlService = async (shortId: string): Promise<string | null> => {
  return await getUrl(shortId);
};
