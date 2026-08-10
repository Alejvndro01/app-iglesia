'use client';

import React, { useState, useRef, useEffect } from 'react';

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
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#eca489] text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-105 transition-all cursor-pointer border-2 border-white"
          title="Hablar con Esperanza"
        >
          💬
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header del Chat */}
          <div className="bg-[#486379] p-4 text-white flex justify-between items-center shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#eca489] flex items-center justify-center text-white font-bold border-2 border-white text-base">
                E
              </div>
              <div>
                <h4 className="text-xs font-bold">Esperanza</h4>
                <p className="text-[10px] text-emerald-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block"></span>
                  <span>IASD Hualqui 24/7</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white font-bold text-sm cursor-pointer px-2 py-1"
            >
              ✕
            </button>
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#eca489] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white text-slate-700 border border-sky-100 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-400 border border-sky-100 p-3 rounded-2xl rounded-bl-none text-[11px] italic animate-pulse">
                  Esperanza está escribiendo...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Formulario de Entrada */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu consulta bíblica..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 text-xs bg-slate-100 p-3 rounded-full outline-none focus:ring-2 focus:ring-[#eca489]/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#eca489] hover:bg-[#e49375] text-white px-4 py-2 rounded-full text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}