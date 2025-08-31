import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';
const JWT_EXPIRY = '1h'; // Adjust as needed (e.g., '15m', '7d')

interface Payload {
  userId: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin'; // Optional role-based access
}

export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const verifyToken = (token: string): Payload => {
  return jwt.verify(token, JWT_SECRET) as Payload;
};