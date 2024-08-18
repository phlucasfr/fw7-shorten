import { Router, Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import { shortenUrlService, getUrlService } from '../services/urlService';
import { CustomRequest } from '../types/customRequest';

export const urlRouter = Router();

urlRouter.post(
  '/shorten',
  body('url').isURL().withMessage('Invalid URL format'),
  async (req: CustomRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;
    if (typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (req.remainingUrls === undefined) {
      return res.status(429).json({ error: 'Você não possui encurtamentos disponíveis.' });
    }

    try {
      const result = await shortenUrlService(url, req.remainingUrls);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error shortening URL:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }    
  }
);

urlRouter.get('/:shortId', async (req: Request, res: Response) => {
  const { shortId } = req.params;
  try {
    const originalUrl = await getUrlService(shortId);
    if (originalUrl) {
      return res.json({ originalUrl });
    } else {
      return res.status(404).json({ error: 'URL not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
