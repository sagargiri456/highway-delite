interface DashboardHeaderProps {
  onSignOut: () => void;
}

const DashboardHeader = ({ onSignOut }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <img src='/assets/iconimage.png' alt="HD Logo" className='w-6 h-6 sm:w-8 sm:h-8 mr-2' />
        <h1 className='text-xl sm:text-2xl font-bold text-gray-800'>HD</h1>
        <span className="text-lg sm:text-xl font-bold text-gray-800 ml-2 sm:ml-4">Dashboard</span>
      </div>
      <button 
        onClick={onSignOut}
        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-sm sm:text-base"
      >
        Sign Out
      </button>
    </div>
  );
};

export default DashboardHeader;
