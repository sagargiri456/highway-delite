import { Request, Response } from 'express';
import User from '../models/User';
import { generateOtp, verifyOtp as verifyOtpCode } from '../utils/otp';
import { sendEmail } from '../utils/sendEmail';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, dateOfBirth } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const otp = generateOtp();
    await sendEmail(email, 'Verify your email', `Your OTP is: ${otp}`);

    const newUser = new User({
      name,
      email,
      dateOfBirth,
      isVerified: false,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    await newUser.save();
    res.status(201).json({ message: 'OTP sent to email for verification' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, 'Your OTP Code', `Your OTP is: ${otp}`);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires || user.otpExpires.getTime() < Date.now())
      return res.status(400).json({ message: 'OTP expired or invalid' });

    const isValid = verifyOtpCode(otp, user.otp);
    if (!isValid) return res.status(401).json({ message: 'Incorrect OTP' });

    user.isVerified = true;
    delete (user as any).otp;
    delete (user as any).otpExpires;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ message: 'OTP verified', token });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified)
      return res.status(404).json({ message: 'User not found or not verified' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, 'Login OTP', `Your login OTP is: ${otp}`);
    res.status(200).json({ message: 'Login OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err });
  }
};
