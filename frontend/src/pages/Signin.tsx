import React, { useState, useEffect } from 'react'
import BlueGradient from '../components/ui/BlueGradient';
import FormInput from '../components/ui/FormInput';
import ErrorMessage from '../components/ui/ErrorMessage';
import Button from '../components/ui/Button';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../api/auth';
import { validateEmail, validateOtp } from '../utils/validation';
import { useCountdown } from '../hooks/useCountdown';
import SplitScreen from '../layouts/SplitScreen';
import GoogleSignInButton from '../components/ui/GoogleSignInButton';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: ''
      });
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otpMessage, setOtpMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ field: string; message: string }[]>([]);
    const [isResendingOtp, setIsResendingOtp] = useState(false);
    
    const { login, loading, error, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const { countdown, isActive, startCountdown } = useCountdown(60);

    // Start countdown when OTP is first sent
    useEffect(() => {
      if (showOtpInput && !isActive) {
        startCountdown();
      }
    }, [showOtpInput, isActive, startCountdown]);

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));

        // Clear validation error for this field when user starts typing
        setValidationErrors(prev => prev.filter(err => err.field !== field));
    };

    const validateCurrentForm = () => {
      const errors: { field: string; message: string }[] = [];
      
      if (showOtpInput) {
        const emailError = validateEmail(formData.email);
        const otpError = validateOtp(formData.otp);
        
        if (emailError) errors.push({ field: 'email', message: emailError });
        if (otpError) errors.push({ field: 'otp', message: otpError });
      } else {
        const emailError = validateEmail(formData.email);
        if (emailError) errors.push({ field: 'email', message: emailError });
      }
      
      setValidationErrors(errors);
      return errors.length === 0;
    };

    const getFieldError = (field: string): string | null => {
      const error = validationErrors.find(err => err.field === field);
      return error ? error.message : null;
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateCurrentForm()) {
          return;
        }

        try {
            await sendOtp(formData.email);
            setShowOtpInput(true);
            setOtpMessage('OTP sent to your email!');
            setValidationErrors([]);
        } catch (error) {
            setOtpMessage(error instanceof Error ? error.message : 'Failed to send OTP');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateCurrentForm()) {
          return;
        }

        try {
            await login(formData.email, formData.otp);
            navigate('/dashboard');
        } catch (error) {
            setOtpMessage(error instanceof Error ? error.message : 'Login failed');
        }
    };

    const handleResendOtp = async () => {
      if (isActive) return;
      
      setIsResendingOtp(true);
      try {
        await sendOtp(formData.email);
        setOtpMessage('OTP resent to your email!');
        startCountdown();
        setValidationErrors([]);
      } catch (error) {
        setOtpMessage(error instanceof Error ? error.message : 'Failed to resend OTP');
      } finally {
        setIsResendingOtp(false);
      }
    };

    const formatCountdown = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex">
          {/* Left Section - Sign In Form */}
                     <div className="w-full md:w-1/2 bg-white p-8 flex flex-col text-center md:text-left">
            {/* Header with Logo */}
            <div className="flex items-center mb-8">
              <img src='/assets/iconimage.png' alt="logo" className='w-8 h-8 mr-2' />
              <h1 className='text-2xl font-bold text-gray-800'>HD</h1>
            </div>
    
            {/* Main Content */}
            <div className="flex-1 flex items-center flex-col justify-center max-w-md">
              {/* Title Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h1>
                <p className="text-gray-600">Sign in to enjoy the features of HD</p>
              </div>

              {/* Success/Error Messages */}
              {otpMessage && (
                <ErrorMessage 
                  message={otpMessage} 
                  type={otpMessage.includes('sent') || otpMessage.includes('resent') ? 'success' : 'error'}
                  className="mb-4"
                />
              )}
              
              {error && (
                <ErrorMessage message={error} type="error" className="mb-4" />
              )}
    
              {/* Form */}
              <form onSubmit={showOtpInput ? handleLogin : handleSendOtp} className="space-y-6 w-full">
                {/* Email Field */}
                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Enter your email address"
                  error={getFieldError('email')}
                />
                
                {/* OTP Field */}
                {showOtpInput && (
                  <div className="space-y-4">
                    <FormInput
                      label="OTP"
                      type="text"
                      value={formData.otp}
                      onChange={handleInputChange('otp')}
                      placeholder="Enter 6-digit OTP"
                      error={getFieldError('otp')}
                    />
                    
                    {/* Resend OTP Section */}
                    <div className="flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendOtp}
                        disabled={isActive}
                        loading={isResendingOtp}
                        className="w-auto"
                      >
                        Resend OTP
                      </Button>
                      
                      {isActive && (
                        <span className="text-sm text-gray-500">
                          Resend in {formatCountdown(countdown)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
    
                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  {showOtpInput ? 'Sign in' : 'Get OTP'}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <GoogleSignInButton
                  onSuccess={async (response) => {
                    try {
                      await googleSignIn(response.access_token);
                      navigate('/dashboard');
                    } catch (error) {
                      console.error('Google sign-in error:', error);
                    }
                  }}
                  onError={(error) => {
                    console.error('Google sign-in error:', error);
                  }}
                  disabled={loading}
                />
              </form>
    
              {/* Footer Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <a href="/signup" className="text-blue-600 font-medium hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
    
          {/* Right Section - Background Image */}
          <div className="hidden md:block w-3/5 mr-2">
            <BlueGradient>
              <img src="/assets/background.png" alt="background_images" className="w-full h-full border-blue-500 object-cover rounded-[24px]" />
            </BlueGradient>
          </div>
        </div>
      );
}

export default Signin