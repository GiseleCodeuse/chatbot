
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.role === 'bot';
  
  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isBot ? 'bg-teal-100 text-teal-600' : 'bg-indigo-100 text-indigo-600'} mb-auto`}>
          {isBot ? <i className="fas fa-robot"></i> : <i className="fas fa-user"></i>}
        </div>
        <div className={`mx-2 p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
          isBot 
            ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
            : 'bg-teal-600 text-white rounded-tr-none'
        }`}>
          {message.content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
          ))}
          <span className={`block text-[10px] mt-1 opacity-60 ${isBot ? 'text-gray-400' : 'text-teal-100'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
