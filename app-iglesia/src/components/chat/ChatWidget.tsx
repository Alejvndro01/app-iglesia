'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageSquare, X, Send, Bot, User, RefreshCw, AlertCircle } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
  } = useChat({
    onError: (err: Error) => {
      console.error('Error en la conexión con la asistente Esperanza:', err);
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, error, status]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    await sendMessage({ text: userText });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg transition-all hover:bg-blue-700"
        >
          <Bot className="h-6 w-6" />
          <span className="font-medium">Hablar con Esperanza</span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[500px] w-[350px] sm:w-[400px] flex-col rounded-2xl bg-white shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Esperanza</h3>
                <p className="text-xs text-blue-100">IASD Hualqui 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-gray-100 p-3 dark:bg-gray-800">
                  ¡Hola! Soy Esperanza 📖. ¿En qué te puedo ayudar hoy sobre la Biblia o nuestra iglesia en Hualqui?
                </div>
              </div>
            )}

            {messages.map((m: UIMessage) => {
              const textParts = m.parts?.filter((p) => p.type === 'text') || [];
              const content = textParts.map((p) => (p as { text: string }).text).join('') || (m as unknown as { content?: string }).content || '';

              return (
                <div
                  key={m.id}
                  className={`flex gap-3 text-sm ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role !== 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-3 max-w-[80%] ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {content}
                  </div>
                  {m.role === 'user' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Única adición: Alerta discreta y botón de reintento si falla la API */}
            {error && (
              <div className="flex flex-col items-center gap-2 p-3 text-center bg-red-50 text-red-600 rounded-xl text-xs dark:bg-red-950/40 dark:text-red-400">
                <span>Tuve un inconveniente al conectar con el servidor.</span>
                <button
                  type="button"
                  onClick={() => regenerate()}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700"
                >
                  <RefreshCw className="h-3 w-3" /> Reintentar
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={onSubmit} className="p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}