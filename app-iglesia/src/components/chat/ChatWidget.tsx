'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy Esperanza 📖. ¿En qué te puedo ayudar hoy sobre la Biblia o nuestra iglesia en Hualqui?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const updatedMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con Esperanza');
      }

      setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Lo siento, tuve un inconveniente al conectar. Intenta nuevamente.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Ventana Flotante del Chat */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[460px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-sky-100 dark:border-slate-800 flex flex-col overflow-hidden transition-colors duration-300 animate-in slide-in-from-bottom duration-200">
          {/* Cabecera Esperanza */}
          <div className="bg-[#486379] dark:bg-slate-800 text-white p-4 flex items-center justify-between border-b border-transparent dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#eca489] flex items-center justify-center text-white font-black text-sm shadow-xs">
                📖
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none text-white dark:text-sky-300">Esperanza</h4>
                <span className="text-[9px] text-sky-100 dark:text-slate-400 font-medium">IASD Hualqui 24/7</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-200 hover:text-white font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Historial de Conversación */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f0f6fb]/50 dark:bg-slate-950/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#eca489] text-white rounded-br-none shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-sky-100 dark:border-slate-700 rounded-bl-none shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-xs px-4 py-2.5 rounded-2xl rounded-bl-none">
                  Esperanza está escribiendo...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-sky-100 dark:border-slate-800 flex space-x-2">
            <input
              type="text"
              placeholder="Escribe tu consulta bíblica..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs px-4 py-2.5 rounded-full border border-amber-100 dark:border-slate-700 outline-none focus:border-[#eca489]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-[#eca489] hover:bg-[#e49375] text-white text-xs font-bold rounded-full disabled:opacity-50 cursor-pointer transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante para Abrir Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#eca489] hover:bg-[#e49375] text-white rounded-full shadow-2xl flex items-center justify-center text-2xl cursor-pointer transition-transform hover:scale-105"
        aria-label="Abrir asistente virtual Esperanza"
      >
        📖
      </button>
    </div>
  );
}