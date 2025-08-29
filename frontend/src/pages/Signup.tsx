import BlueGradient from '../components/ui/BlueGradient';
import FormInput from '../components/ui/FormInput';
import { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    name: 'Jonas Khanwald',
    dob: '1997-12-11',
    email: 'jonas_kahnwald@gmail.com'
  });
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
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
            <p className="text-gray-600">Sign up to enjoy the feature of HD</p>
          </div>

          {/* Form */}
          <form  className="space-y-6">
            {/* Name Field */}
            <FormInput
              label="Your Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
            />

            {/* Date of Birth Field */}
            <FormInput
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={handleInputChange('dob')}
            />

            {/* Email Field */}
            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Get OTP
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account??{' '}
              <a href="#" className="text-blue-600 font-medium hover:underline">
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
