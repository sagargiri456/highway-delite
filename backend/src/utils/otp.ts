export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP
  };
  
export const verifyOtp = (inputOtp: string, storedOtp: string): boolean => {
return inputOtp === storedOtp;
};
  