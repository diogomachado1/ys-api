import { Request, Response, NextFunction } from 'express';

const secret = process.env.INTERNAL_SECRET || 'secret';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['api-secret'];
  if (authHeader !== secret) {
    return res.status(401).json({ message: 'Invalid Auth' });
  }

  return next();
};
