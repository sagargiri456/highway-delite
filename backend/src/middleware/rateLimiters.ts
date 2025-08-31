import { RequestHandler } from 'express';

// Store to track OTP requests per email
const otpRequestStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of otpRequestStore.entries()) {
    if (now > data.resetTime) {
      otpRequestStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

export const otpLimiter: RequestHandler = (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3;

  // Get current data for this email
  const currentData = otpRequestStore.get(email);
  
  if (!currentData || now > currentData.resetTime) {
    // First request or window expired, start new count
    otpRequestStore.set(email, {
      count: 1,
      resetTime: now + windowMs
    });
    return next();
  }

  // Check if limit exceeded
  if (currentData.count >= maxRequests) {
    const timeLeft = Math.ceil((currentData.resetTime - now) / 1000 / 60);
    return res.status(429).json({
      message: `Too many OTP requests for this email. Please try again in ${timeLeft} minutes.`,
      retryAfter: timeLeft * 60
    });
  }

  // Increment count
  currentData.count++;
  otpRequestStore.set(email, currentData);
  
  next();
};
