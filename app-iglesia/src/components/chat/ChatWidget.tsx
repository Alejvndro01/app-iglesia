'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy Esperanza 📖. ¿En qué te puedo ayudar hoy sobre la Biblia o nuestra iglesia en Hualqui?',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages([...newHistory, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...newHistory,
          { role: 'assistant', content: 'Lo siento, tuve un inconveniente al conectar. Intenta nuevamente.' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 antialiased">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#7C9885] hover:bg-[#6B8774] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all cursor-pointer border-2 border-white dark:border-slate-800"
          title="Hablar con Esperanza"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[500px] bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl shadow-xl border border-[#E2DEC9] dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors">
          {/* Header del Chat */}
          <div className="bg-[#7C9885] dark:bg-slate-900 p-4 text-white flex justify-between items-center border-b border-[#6B8774] dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 font-bold text-sm border border-white/20">
                E
              </div>
              <div>
                <h4 className="text-xs font-bold text-white dark:text-emerald-100 flex items-center gap-1">
                  Esperanza <Sparkles className="w-3 h-3 text-[#FAF8F3]" />
                </h4>
                <p className="text-[10px] text-[#E8EFEA] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse inline-block"></span>
                  <span>IASD Hualqui 24/7</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#E8EFEA] hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F1EA]/50 dark:bg-slate-950/50 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#7C9885] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white dark:bg-slate-900 text-[#2D3831] dark:text-slate-100 border border-[#E2DEC9] dark:border-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 text-[#66756C] dark:text-slate-400 border border-[#E2DEC9] dark:border-slate-800 p-3 rounded-2xl rounded-bl-none text-[11px] italic flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7C9885]" />
                  <span>Esperanza está escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Formulario de Entrada */}
          <form onSubmit={sendMessage} className="p-3 bg-[#FAF8F3] dark:bg-slate-900 border-t border-[#E8E4D5] dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu consulta bíblica..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs bg-white dark:bg-slate-950 text-[#2D3831] dark:text-slate-100 placeholder-[#8C9B90] dark:placeholder-slate-500 px-4 py-2.5 rounded-xl border border-[#DCD7C5] dark:border-slate-800 outline-none focus:border-[#7C9885]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#7C9885] hover:bg-[#6B8774] text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}