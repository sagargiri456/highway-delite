import { RequestHandler } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import User from '../models/User';

export const verifyToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const tokenPart = authHeader.split(' ')[1];
  if (!tokenPart) {
    return res.status(401).json({ message: 'Token missing' });
  }
  const secretKeyEnv = process.env.JWT_SECRET;
  if (!secretKeyEnv) {
    return res.status(500).json({ message: 'JWT_SECRET is not set' });
  }
  const secretKey: Secret = secretKeyEnv as Secret;

  try {
    const decoded = jwt.verify(tokenPart, secretKey) as JwtPayload & { id?: string };
    const userId = decoded && (decoded as any).id;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    (req as any).user = { id: user.id };
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Token verification failed', error: err });
  }
};
