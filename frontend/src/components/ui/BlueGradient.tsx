import React from 'react';

interface BlueGradientProps {
  children: React.ReactNode;
}

export default function BlueGradient({ children }: BlueGradientProps) {
  return (
    <div className="relative my-1 border-r- w-full h-full rounded-3xl overflow-hidden">
      {children}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/40 rounded-3xl"></div>
    </div>
  );
}
