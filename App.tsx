
import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from './types';
import { ChatBubble } from './components/ChatBubble';
import { LoadingDots } from './components/LoadingDots';
import { SkinDiagnosisService } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'chat'>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosisService] = useState(() => new SkinDiagnosisService());
  const scrollRef = useRef<HTMLDivElement>(null);

  const startChat = async () => {
    setView('chat');
    setIsTyping(true);
    
    const botMsgId = Math.random().toString(36).substring(7);
    const initialBotMsg: Message = {
      id: botMsgId,
      role: 'bot',
      content: '',
      timestamp: new Date()
    };
    setMessages([initialBotMsg]);

    await diagnosisService.startConversation((text) => {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: text } : m));
    });
    setIsTyping(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (role: Role, content: string): string => {
    const id = Math.random().toString(36).substring(7);
    const newMessage: Message = {
      id,
      role,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return id;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    setInputValue('');
    addMessage('user', userText);
    setIsTyping(true);
    
    const botMsgId = addMessage('bot', '');
    
    try {
      let fullContent = "";
      const stream = diagnosisService.sendMessageStream(userText);
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: fullContent } : m));
      }
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, content: "Désolée, j'ai eu une petite absence. Peux-tu répéter ?" } : m));
    } finally {
      setIsTyping(false);
    }
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-md w-full">
          <div className="w-24 h-24 bg-[#F8E1E7] rounded-full flex items-center justify-center text-[#D48197] text-4xl mb-8 mx-auto shadow-sm">
            <i className="fas fa-spa"></i>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#4A4A4A] mb-4">Révélez l'éclat de votre peau</h1>
          <p className="text-[#8E8E8E] mb-10 leading-relaxed">
            Découvrez votre routine idéale grâce à notre diagnostic intelligent. Une analyse douce, rapide et personnalisée.
          </p>
          
          <div className="space-y-4 mb-12 text-left">
            <div className="flex items-center gap-4 text-[#6B6B6B]">
              <div className="w-8 h-8 rounded-full bg-[#E8F3F1] flex items-center justify-center text-[#A7D7C5]">
                <i className="fas fa-check text-xs"></i>
              </div>
              <span>Analyse par IA en 2 minutes</span>
            </div>
            <div className="flex items-center gap-4 text-[#6B6B6B]">
              <div className="w-8 h-8 rounded-full bg-[#E8F3F1] flex items-center justify-center text-[#A7D7C5]">
                <i className="fas fa-check text-xs"></i>
              </div>
              <span>Déterminez votre type de peau</span>
            </div>
            <div className="flex items-center gap-4 text-[#6B6B6B]">
              <div className="w-8 h-8 rounded-full bg-[#E8F3F1] flex items-center justify-center text-[#A7D7C5]">
                <i className="fas fa-check text-xs"></i>
              </div>
              <span>Conseils bienveillants</span>
            </div>
          </div>

          <button 
            onClick={startChat}
            className="w-full bg-[#D48197] hover:bg-[#C27187] text-white font-medium py-4 rounded-full shadow-lg shadow-pink-100 transition-all hover:scale-[1.02] active:scale-95"
          >
            Commencer mon diagnostic
          </button>
          <p className="mt-6 text-[11px] text-[#C0C0C0] uppercase tracking-widest">Dermaly • Premium Skincare IA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FFFDFB] max-w-2xl mx-auto md:shadow-2xl overflow-hidden">
      {/* Header Soft */}
      <header className="bg-white/80 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-[#F8E1E7] sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#F8E1E7] rounded-full flex items-center justify-center text-[#D48197]">
            <i className="fas fa-magic"></i>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-[#4A4A4A]">Dermaly</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-[#A7D7C5] rounded-full animate-pulse"></span>
              <p className="text-xs text-[#A7D7C5] font-medium uppercase tracking-tighter">Votre experte en ligne</p>
            </div>
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="text-[#D48197] hover:rotate-180 transition-transform duration-500">
          <i className="fas fa-redo-alt"></i>
        </button>
      </header>

      {/* Chat Area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && messages[messages.length - 1]?.content === '' && <LoadingDots />}
      </main>

      {/* Soft Input */}
      <footer className="p-4 bg-white border-t border-[#F8E1E7]">
        <div className="flex items-center gap-2 bg-[#F9F9F9] rounded-3xl px-4 py-2 border border-[#F2F2F2] focus-within:border-[#D48197] focus-within:bg-white transition-all shadow-sm">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Dites-moi tout..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-[#4A4A4A] py-2 resize-none text-sm"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              !inputValue.trim() || isTyping ? 'text-gray-300' : 'text-[#D48197] hover:scale-110'
            }`}
          >
            <i className="fas fa-paper-plane text-xl"></i>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
