import jwt from 'jsonwebtoken';

interface Payload {
  userId: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin'; // Optional role-based access
}

export const generateTokens = (payload: Payload,userId:string) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};
