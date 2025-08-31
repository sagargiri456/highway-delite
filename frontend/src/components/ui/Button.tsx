import LoadingSpinner from './LoadingSpinner';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = ''
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400';
      case 'outline':
        return 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-300';
      case 'ghost':
        return 'bg-transparent text-blue-600 hover:bg-blue-50 disabled:bg-transparent disabled:text-gray-400';
      case 'primary':
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-4 text-lg';
      case 'md':
      default:
        return 'px-4 py-3';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        w-full font-medium rounded-lg transition-colors duration-200 
        disabled:cursor-not-allowed flex items-center justify-center gap-2
        ${getVariantClasses()} ${getSizeClasses()} ${className}
      `}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}
