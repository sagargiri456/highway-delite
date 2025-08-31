import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: 'Google Client ID not configured' });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: 'Invalid ID token' });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        name: name || 'Google User',
        email,
        dateOfBirth: new Date('1990-01-01'), // Default date for Google users
        googleId,
        isVerified: true, // Google users are pre-verified
        profilePicture: picture,
        authProvider: 'google'
      });
      await user.save();
    } else {
      // Update existing user's Google info
      user.googleId = googleId;
      user.isVerified = true;
      if (picture) user.profilePicture = picture;
      user.authProvider = 'google';
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

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
    console.error('Google sign-in error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Google sign-in failed',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
