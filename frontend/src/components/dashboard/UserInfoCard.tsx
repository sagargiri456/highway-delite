interface UserInfoCardProps {
  name: string;
  email: string;
}

const UserInfoCard = ({ name, email }: UserInfoCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1">
        Welcome, {name} !
      </h2>
      <p className="text-sm text-gray-600">
        Email: {email}
      </p>
    </div>
  );
};

export default UserInfoCard;
