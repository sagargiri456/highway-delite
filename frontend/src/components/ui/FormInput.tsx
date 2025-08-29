
interface Props {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
  }

  export default function FormInput({ label, type = "text", value, onChange, placeholder, error }: Props) {
    return (
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 pt-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-300"
          } ${type === "email" ? "border-2 border-blue-500" : ""}`}
        />
        <label className="absolute top-0.01 left-3 text-xs font-medium text-gray-600 bg-white px-1">
          {label}
        </label>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
