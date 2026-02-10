
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.role === 'bot';
  
  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`flex max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        {isBot && (
          <div className="w-8 h-8 rounded-full bg-[#F8E1E7] flex items-center justify-center text-[#D48197] text-xs flex-shrink-0 mb-1">
            <i className="fas fa-sparkles"></i>
          </div>
        )}
        <div className={`px-5 py-3 rounded-[2rem] shadow-sm text-sm md:text-base leading-relaxed ${
          isBot 
            ? 'bg-white text-[#4A4A4A] rounded-bl-none border border-[#F8E1E7]' 
            : 'bg-[#D48197] text-white rounded-br-none'
        }`}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
          ))}
          <div className={`text-[10px] mt-2 opacity-50 ${isBot ? 'text-[#D48197]' : 'text-white'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
