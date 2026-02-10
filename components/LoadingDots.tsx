
import React from 'react';

export const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-1 p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none w-16 shadow-sm mb-4 animate-fade-in">
      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};
