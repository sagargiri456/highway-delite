interface UserInfoCardProps {
  name: string;
  email: string;
}

const UserInfoCard = ({ name, email }: UserInfoCardProps) => {
  // Function to mask email for privacy
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    
    const maskedLocal = localPart.charAt(0) + 'x'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 mb-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
        Welcome, {name}!
      </h2>
      <p className="text-sm text-gray-600">
        Email: <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800 transition-colors break-all">
          {maskEmail(email)}
        </a>
      </p>
    </div>
  );
};

export default UserInfoCard;
