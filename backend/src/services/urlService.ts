import { v4 as uuidv4 } from 'uuid';
import URLParse from 'url-parse';
import { saveUrl, getUrl } from '../repositories/urlRepository';

interface ShortenPayload {
  shortUrl: string;
  remaining: number;
  shortId: string;
}

const generateShortId = (): string => uuidv4().slice(0, 8);

export const shortenUrlService = async (originalUrl: string, remainingUrls: number): Promise<ShortenPayload> => {
  const shortId: string = generateShortId();

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

export const getUrlService = async (shortId: string): Promise<string | null> => {
  return await getUrl(shortId);
};
