import type { User } from '../types/authtypes';

const API_BASE_URL = "http://localhost:5000/api" ;

// Signup API - registers user and sends OTP
export const signupApi = async (data: { name: string; dob: string; email: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      dateOfBirth: data.dob,
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Signup failed');
  }
  
  return result;
};

// Send OTP API
export const sendOtp = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to send OTP');
  }
};

// Send Login OTP API
export const sendLoginOtp = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-login-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to send login OTP');
  }
};

// Verify OTP API - verifies OTP and returns user with token
export const verifyOtpApi = async (email: string, otp: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'OTP verification failed');
  }

  // Store token in localStorage (handle both token and accessToken fields)
  const token = result.token || result.accessToken;
  if (token) {
    localStorage.setItem('token', token);
  }

  // Return user object
  return {
    name: result.user?.name || '',
    email: result.user?.email || email,
    dateOfBirth: result.user?.dateOfBirth || '',
    isVerified: result.user?.isVerified || true,
    token: token,
  };
};

// Get current user from token
export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Failed to get user info');
  }

  return {
    name: result.user?.name || '',
    email: result.user?.email || '',
    dateOfBirth: result.user?.dateOfBirth || '',
    isVerified: result.user?.isVerified || true,
    token: token,
  };
};

// Login API - sends OTP for login
export const loginApi = async (email: string, otp: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }

  // Store token in localStorage (handle both token and accessToken fields)
  const token = result.accessToken || result.token;
  if (token) {
    localStorage.setItem('token', token);
  }

  // Return user object
  return {
    name: result.user?.name || '',
    email: result.user?.email || email,
    dateOfBirth: result.user?.dateOfBirth || '',
    isVerified: result.user?.isVerified || true,
    token: token,
  };
};

// Google OAuth API
export const googleSignInApi = async (idToken: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Google sign-in failed');
  }

  // Store token in localStorage
  const token = result.accessToken;
  if (token) {
    localStorage.setItem('token', token);
  }

  // Return user object
  return {
    name: result.user?.name || '',
    email: result.user?.email || '',
    dateOfBirth: result.user?.dateOfBirth || '',
    isVerified: result.user?.isVerified || true,
    token: token,
    profilePicture: result.user?.profilePicture,
    authProvider: result.user?.authProvider || 'google',
  };
};
