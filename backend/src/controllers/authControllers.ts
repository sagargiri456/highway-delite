import { Request, Response } from 'express';
import User from '../models/User';
import { generateOtp, verifyOtp as verifyOtpCode } from '../utils/otp';
import { sendEmail } from '../utils/sendEmail';
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, dateOfBirth } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) console.log("User Exist")
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

export const sendLoginOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, 'Your Login OTP Code', `Your login OTP is: ${otp}`);
    res.status(200).json({ message: 'Login OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send login OTP', error: err });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  console.log("entered in verifyOtp backend route.")
  const { email, otp } = req.body;
  console.log(email)
  console.log(otp)
  try {
    const user = await User.findOne({ email });
    if(user) console.log(user.otp)
    if (!user || !user.otp || !user.otpExpires || user.otpExpires.getTime() < Date.now())
      return res.status(400).json({ message: 'OTP expired or invalid' });

    const isValid = verifyOtpCode(otp, user.otp);
    console.log(isValid)
    if (!isValid) return res.status(401).json({ message: 'Incorrect OTP' });

    user.isVerified = true;
    try{delete (user as any).otp;}
    catch(error){
      console.log(error)
    }
    console.log("tried to delete user.otp")
    delete (user as any).otpExpires;
    await user.save();
    console.log("came upto await user.save()")
    console.log(process.env.JWT_SECRET)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.status(200).json({ 
      message: 'OTP verified', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err });
  }
};

// export const loginUser = async (req: Request, res: Response) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || !user.isVerified)
//       return res.status(404).json({ message: 'User not found or not verified' });

//     const otp = generateOtp();
//     user.otp = otp;
//     user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
//     await user.save();

//     await sendEmail(email, 'Login OTP', `Your login OTP is: ${otp}`);
//     res.status(200).json({ message: 'Login OTP sent' });
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed', error: err });
//   }
// };

export const verifyOtpAndLogin = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified || !user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < new Date())
      return res.status(401).json({ message: 'Invalid or expired OTP' });

    // Clear OTP fields after successful verification
    delete (user as any).otp;
    delete (user as any).otpExpires;
    await user.save();

    // Generate JWT token using JWT_SECRET (same as middleware)
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      accessToken: token, // Keep accessToken field for frontend compatibility
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'Refresh token missing' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate new JWT token using JWT_SECRET (same as middleware)
    const newAccessToken = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user is set by the verifyToken middleware
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId).select('-otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user info', error: err });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};