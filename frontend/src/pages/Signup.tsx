import BlueGradient from '../components/ui/BlueGradient';
import FormInput from '../components/ui/FormInput';
import ErrorMessage from '../components/ui/ErrorMessage';
import Button from '../components/ui/Button';
import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { validateForm, getFieldError, type ValidationError } from '../utils/validation';
import { useCountdown } from '../hooks/useCountdown';
import { sendOtp } from '../api/auth';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    otp: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showOtpValidationInput, setShowOtpValidationInput] = useState<boolean>(false);
  const [otpMessage, setOtpMessage] = useState<string>('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  
  const { signup, verifyOtp, loading, error } = useAuth();
  const navigate = useNavigate();
  const { countdown, isActive, startCountdown, restartCountdown } = useCountdown(60);



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
    const fieldsToValidate: (keyof typeof formData)[] = showOtpValidationInput 
      ? ['email', 'otp'] 
      : ['name', 'email', 'dob'];
    
    const errors = validateForm(formData, fieldsToValidate);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentForm()) {
      return;
    }

    try {
      await signup({
        name: formData.name,
        dob: formData.dob,
        email: formData.email
      });
      setShowOtpValidationInput(true);
      setOtpMessage('OTP sent to your email!');
      startCountdown(); // Start countdown when OTP is first sent
      setValidationErrors([]);
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        setOtpMessage(error.message);
      }
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentForm()) {
      return;
    }

    try {
      await verifyOtp(formData.email, formData.otp);
      console.log("OTP verified successfully");
      navigate('/dashboard');
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpMessage(error instanceof Error ? error.message : 'OTP verification failed');
    }
  };

  const handleResendOtp = async () => {
    if (isActive) return;
    
    setIsResendingOtp(true);
    try {
      await sendOtp(formData.email);
      setOtpMessage('OTP resent to your email!');
      restartCountdown(); // Restart countdown with fresh 60 seconds
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
      {/* Left Section - Sign Up Form */}
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign up</h1>
            <p className="text-gray-600">Sign up to enjoy the features of HD</p>
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
          <form onSubmit={showOtpValidationInput ? handleOtpVerification : handleSubmit} className="space-y-6 w-full">
            {/* Name Field */}
            {!showOtpValidationInput && (
              <FormInput
                label="Your Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter your full name"
                error={getFieldError(validationErrors, 'name')}
              />
            )}

            {/* Date of Birth Field */}
            {!showOtpValidationInput && (
              <FormInput
                label="Date of Birth"
                type="date"
                value={formData.dob}
                onChange={handleInputChange('dob')}
                error={getFieldError(validationErrors, 'dob')}
              />
            )}

            {/* Email Field */}
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Enter your email address"
              error={getFieldError(validationErrors, 'email')}
            />

            {/* OTP input field */}
            {showOtpValidationInput && (
              <div className="space-y-4">
                <FormInput
                  label="Enter OTP"
                  type="text"
                  value={formData.otp}
                  onChange={handleInputChange('otp')}
                  placeholder="Enter 6-digit OTP"
                  error={getFieldError(validationErrors, 'otp')}
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

            {/* Submit Buttons */}
            {showOtpValidationInput ? (
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Verify OTP
              </Button>
            ) : (
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                Get OTP
              </Button>
            )}
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/signin" className="text-blue-600 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Background Image */}
      <div className="hidden md:block w-3/5 m-0.5 mr-2">
        <BlueGradient>
          <img src="/assets/background.png" alt="background_images" className="w-full h-full border-blue-500 object-cover rounded-[24px]" />
        </BlueGradient>
      </div>
    </div>
  );
}

export default Signup;
