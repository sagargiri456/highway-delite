import express from 'express';
import {
  registerUser,
  sendOtp,
  sendLoginOtp,
  verifyOtp,
  refreshAccessToken,
  verifyOtpAndLogin,
  logoutUser,
  getCurrentUser
} from '../controllers/authControllers';
import { handleValidation, validateLogin, validateRegister, validateSendOtp, validateVerifyOtp } from '../middleware/validators';
import { otpLimiter } from '../middleware/rateLimiters';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', validateRegister, handleValidation, registerUser);
router.post('/send-otp', otpLimiter, validateSendOtp, handleValidation, sendOtp);
router.post('/send-login-otp', otpLimiter, validateSendOtp, handleValidation, sendLoginOtp);
router.post('/verify-otp', validateVerifyOtp, handleValidation, verifyOtp);
router.post('/login', otpLimiter, validateLogin, handleValidation, verifyOtpAndLogin);
router.get('/me', authenticate, getCurrentUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

export default router;
