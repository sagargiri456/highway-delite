export interface ValidationError {
  field: string;
  message: string;
}

export interface FormData {
  name: string;
  email: string;
  dob: string;
  otp: string;
}

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (name.length > 50) {
    return 'Name must be less than 50 characters';
  }
  
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return 'Name can only contain letters and spaces';
  }
  
  return null;
};

export const validateDateOfBirth = (dob: string): string | null => {
  if (!dob) {
    return 'Date of birth is required';
  }
  
  const selectedDate = new Date(dob);
  const today = new Date();
  const minAge = new Date();
  minAge.setFullYear(today.getFullYear() - 13); // Minimum age 13
  
  if (selectedDate > today) {
    return 'Date of birth cannot be in the future';
  }
  
  if (selectedDate > minAge) {
    return 'You must be at least 13 years old';
  }
  
  return null;
};

export const validateOtp = (otp: string): string | null => {
  if (!otp) {
    return 'OTP is required';
  }
  
  if (otp.length !== 6) {
    return 'OTP must be 6 digits';
  }
  
  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return 'OTP must contain only numbers';
  }
  
  return null;
};

export const validateForm = (formData: Partial<FormData>, fields: (keyof FormData)[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  fields.forEach(field => {
    let error: string | null = null;
    
    switch (field) {
      case 'name':
        error = validateName(formData.name || '');
        break;
      case 'email':
        error = validateEmail(formData.email || '');
        break;
      case 'dob':
        error = validateDateOfBirth(formData.dob || '');
        break;
      case 'otp':
        error = validateOtp(formData.otp || '');
        break;
    }
    
    if (error) {
      errors.push({ field, message: error });
    }
  });
  
  return errors;
};

export const getFieldError = (errors: ValidationError[], field: string): string | null => {
  const error = errors.find(err => err.field === field);
  return error ? error.message : null;
};
