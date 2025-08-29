import { Sun } from 'lucide-react';

interface DashboardHeaderProps {
  onSignOut: () => void;
}

const DashboardHeader = ({ onSignOut }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Sun className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>
      <button 
        onClick={onSignOut}
        className="text-blue-600 underline font-medium"
      >
        Sign Out
      </button>
    </div>
  );
};

export default DashboardHeader;
