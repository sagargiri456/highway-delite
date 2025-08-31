import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/authtypes';
import { sendOtp, verifyOtpApi, loginApi, signupApi, getCurrentUser, googleSignInApi } from '../api/auth';

// Create the context
const AuthContext = createContext<any>(undefined);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // State variables
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Signup function
  const signup = async (data: { name: string; dob: string; email: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      // Register user and send OTP
      await signupApi(data);
      await sendOtp(data.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const verifiedUser = await verifyOtpApi(email, otp);
      setUser(verifiedUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send login OTP function
  const sendLoginOtp = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await sendOtp(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await loginApi(email, otp);
      setUser(loggedInUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-in function
  const googleSignIn = async (idToken: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const googleUser = await googleSignInApi(idToken);
      setUser(googleUser);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signup,
    sendLoginOtp,
    verifyOtp,
    login,
    googleSignIn,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
