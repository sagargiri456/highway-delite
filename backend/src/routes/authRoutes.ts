import express from 'express';
import {
  registerUser,
  sendOtp,
  verifyOtp,
  loginUser
} from '../controllers/authControllers';
import { handleValidation, validateLogin, validateRegister, validateSendOtp, validateVerifyOtp } from '../middleware/validators';
import { otpLimiter } from '../middleware/rateLimiters';

const router = express.Router();

router.post('/register', validateRegister, handleValidation, registerUser);
router.post('/send-otp', otpLimiter, validateSendOtp, handleValidation, sendOtp);
router.post('/verify-otp', validateVerifyOtp, handleValidation, verifyOtp);
router.post('/login', otpLimiter, validateLogin, handleValidation, loginUser);

export default router;
