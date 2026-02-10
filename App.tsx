
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Role } from './types';
import { ChatBubble } from './components/ChatBubble';
import { LoadingDots } from './components/LoadingDots';
import { SkinDiagnosisService } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosisService] = useState(() => new SkinDiagnosisService());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const initChat = async () => {
      setIsTyping(true);
      const welcomeMessage = await diagnosisService.startConversation();
      addMessage('bot', welcomeMessage);
      setIsTyping(false);
    };
    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (role: Role, content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    addMessage('user', userText);
    
    setIsTyping(true);
    try {
      const botResponse = await diagnosisService.sendMessage(userText);
      addMessage('bot', botResponse);
    } catch (error) {
      addMessage('bot', "Oups, j'ai rencontré un petit problème. Pourriez-vous répéter ?");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-2xl mx-auto shadow-xl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-inner">
            <i className="fas fa-leaf"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">Dermaly</h1>
            <p className="text-xs text-teal-600 font-medium">Diagnostic de peau IA</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-gray-400 hover:text-teal-600 transition-colors p-2"
          title="Recommencer"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 chat-container scroll-smooth"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <LoadingDots />}
        
        {messages.length === 0 && !isTyping && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <i className="fas fa-comments text-4xl mb-4 opacity-20"></i>
            <p>Initialisation du diagnostic...</p>
          </div>
        )}
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Écrivez votre réponse ici..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-3 text-sm max-h-32 min-h-[40px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              !inputValue.trim() || isTyping 
                ? 'bg-gray-300 text-gray-500' 
                : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
            }`}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          Réponses basées sur l'analyse de vos sensations. Aucun avis médical.
        </p>
      </footer>
    </div>
  );
};

export default App;
