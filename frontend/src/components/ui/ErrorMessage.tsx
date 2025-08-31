interface ErrorMessageProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  className?: string;
}

export default function ErrorMessage({ message, type = 'error', className = '' }: ErrorMessageProps) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'error':
      default:
        return 'bg-red-50 text-red-700 border border-red-200';
    }
  };

  return (
    <div className={`w-full p-3 rounded-lg text-sm ${getStyles()} ${className}`}>
      {message}
    </div>
  );
}
