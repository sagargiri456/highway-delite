import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    console.log('🚀 Google auth started');
    console.log('📦 Request body:', req.body);
    
    const { idToken } = req.body;

    if (!idToken) {
      console.log('❌ No idToken provided');
      return res.status(400).json({ message: 'ID token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.log('❌ Google Client ID not configured');
      return res.status(500).json({ message: 'Google Client ID not configured' });
    }

    console.log('🔍 Verifying ID token with Google...');
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    console.log('✅ Google verification successful');
    const payload = ticket.getPayload();
    
    if (!payload) {
      console.log('❌ Invalid payload from Google');
      return res.status(400).json({ message: 'Invalid ID token' });
    }

    const { email, name, picture, sub: googleId } = payload;
    console.log('👤 User info from Google:', { email, name, googleId });

    if (!email) {
      console.log('❌ No email from Google');
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    console.log('🔍 Checking if user exists in database...');
    // Check if user already exists
    let user = await User.findOne({ email });
    console.log('👤 Existing user found:', !!user);

    if (!user) {
      console.log('🆕 Creating new user...');
      // Create new user if they don't exist
      user = new User({
        name: name || 'Google User',
        email,
        dateOfBirth: new Date('1990-01-01'),
        googleId,
        isVerified: true,
        profilePicture: picture,
        authProvider: 'google'
      });
      await user.save();
      console.log('✅ New user created');
    } else {
      console.log('🔄 Updating existing user...');
      // Update existing user's Google info
      user.googleId = googleId;
      user.isVerified = true;
      if (picture) user.profilePicture = picture;
      user.authProvider = 'google';
      await user.save();
      console.log('✅ User updated');
    }

    console.log('🔐 Generating JWT token...');
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    console.log('✅ Google auth completed successfully');
    res.status(200).json({
      success: true,
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider
      }
    });

} catch (error) {
  console.error('💥 Google sign-in error:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    name: error instanceof Error ? error.name : 'Unknown',
    fullError: error
  });
  res.status(500).json({ 
    success: false,
    message: 'Google sign-in failed',
    error: process.env.NODE_ENV === 'development' 
      ? (error instanceof Error ? error.message : 'Unknown error') 
      : undefined
  });
}}