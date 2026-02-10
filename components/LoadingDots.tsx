
import React from 'react';

export const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-2 p-4 bg-white border border-[#F8E1E7] rounded-[2rem] rounded-bl-none w-20 shadow-sm mb-4 animate-fade-in">
      <div className="w-2 h-2 bg-[#D48197] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-[#D48197] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-[#D48197] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};
