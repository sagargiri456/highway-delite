// src/components/ui/HDButton.tsx
interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    disabled?: boolean;
  }
  
  export default function HDButton({ children, onClick, type = "button", disabled = false }: Props) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {children}
      </button>
    );
  }
  