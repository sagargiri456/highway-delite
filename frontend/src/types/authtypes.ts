// types/auth.ts
export interface User {
    name: string;
    email: string;
    dateOfBirth: string;
    isVerified: boolean;
    token?: string;
    profilePicture?: string;
    authProvider?: 'email' | 'google';
  }
  
  export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface AuthContextType extends AuthState {
    login: (email: string, otp: string) => Promise<void>;
    signup: (data: { name: string; dob: string; email: string }) => Promise<void>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    logout: () => void;
    googleSignIn: (idToken: string) => Promise<void>;
  }
  