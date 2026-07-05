import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Bot, User, Loader2, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { aiService } from '../services/apiService';
import ProductCard from '../components/ProductCard';

const AssistantPage: React.FC = () => {
  const { chatHistory, addChatMessage } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, content: input };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      const data = await aiService.chat(input);
      const botMsg = { 
        role: 'assistant' as const, 
        content: data.response,
        suggestedProducts: data.suggestedProducts
      };
      addChatMessage(botMsg);
    } catch (error) {
      console.error("Chat error", error);
      addChatMessage({ role: 'assistant', content: "Sorry, I'm having trouble connecting right now." });
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = () => {
    // Simulated visual search
    setIsTyping(true);
    setTimeout(async () => {
      try {
        const data = await aiService.visualSearch();
        addChatMessage({ role: 'user', content: "[Uploaded Image]" });
        addChatMessage({ 
          role: 'assistant', 
          content: data.analysis,
          suggestedProducts: data.results
        });
      } finally {
        setIsTyping(false);
      }
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col pt-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Bot size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black">VisionShop AI</h1>
            <p className="text-xs text-green-500 font-bold flex items-center gap-1.5 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Agent Online
            </p>
          </div>
        </div>
        <Button variant="ghost" className="rounded-xl font-bold gap-2 text-slate-500">
          <Search size={18} />
          Back to browsing
        </Button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 space-y-10 scroll-smooth custom-scrollbar"
      >
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 pb-20">
            <div className="relative group">
              <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <Bot size={80} className="text-primary relative" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black italic">How can I help you today?</h2>
              <p className="text-slate-500 text-lg max-w-md mx-auto">
                Ask me anything about products, comparison specs, or upload a photo to find something similar.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
               {[
                 "Minimalist shoes for urban walking",
                 "High performance laptop under $1500",
                 "Compare SoundSilence with Focus Watch",
                 "What are the pros of VisionPro Max?"
               ].map((q, i) => (
                 <button 
                   key={i}
                   onClick={() => setInput(q)}
                   className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-left hover:border-primary/50 hover:bg-primary/5 transition-all group"
                 >
                    <p className="text-sm font-bold text-slate-400 group-hover:text-primary transition-colors italic">"{q}"</p>
                 </button>
               ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className="space-y-6">
                <div className={`p-6 rounded-[2rem] text-lg font-medium leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20' 
                  : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>

                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {msg.suggestedProducts.map(p => (
                      <div key={p.id} className="w-[280px]">
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex gap-4">
             <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Bot size={20} />
             </div>
             <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={18} className="animate-spin text-primary" />
                <span className="text-slate-400 font-bold italic">AI is thinking...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 shrink-0">
        <div className="relative max-w-4xl mx-auto group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.2rem] p-3 flex items-center gap-3 shadow-2xl">
            <button 
              onClick={handleImageUpload}
              className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/5 transition-all shrink-0"
            >
              <ImageIcon size={24} />
            </button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              type="text" 
              placeholder="Ask anything or upload an image..." 
              className="flex-1 bg-transparent border-none outline-none px-4 text-lg font-medium"
            />
            <button 
              onClick={handleSend}
              className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-4">
          Visual search Treatment: Treat image and text as equally first-class
        </p>
      </div>
    </div>
  );
};

export default AssistantPage;
