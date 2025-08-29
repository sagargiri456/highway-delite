export default function SplitScreen({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen w-full">
        <div className="w-full md:w-[40%] bg-white p-8 flex items-center justify-center">
          {children}
        </div>
        <div className="hidden md:block w-[60%] bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#3B82F6]">
          {/* Optional: Add 3D wave SVG or background image here */}
        </div>
      </div>
    );
  }
  