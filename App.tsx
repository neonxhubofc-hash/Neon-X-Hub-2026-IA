import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Sparkles, StopCircle, RefreshCw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MarkdownRenderer from './components/MarkdownRenderer';
import { sendMessageToGeminiStream, resetChat } from './services/geminiService';
import { Message, MessageRole } from './types';
import { GenerateContentResponse } from '@google/genai';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: MessageRole.Model,
      content: "Olá! Eu sou a **Neon X Hub IA** 🤖.\n\nFui criada por **Ressel** com o poder do **Poderoso Hub ⚡** para ser sua especialista definitiva em scripts **Lua e Luau** para Roblox.\n\nPosso ajudar você a:\n- Criar e corrigir scripts complexos.\n- Otimizar performance do jogo.\n- Explicar conceitos da Roblox API.\n\nQual é o seu desafio técnico hoje?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleNewChat = () => {
    resetChat();
    setMessages([{
      id: Date.now().toString(),
      role: MessageRole.Model,
      content: "Memória reiniciada. 🧠\n\nEstou pronta para uma nova análise técnica. O que vamos codar agora?",
      timestamp: new Date()
    }]);
    setIsSidebarOpen(false); // Close sidebar on mobile when new chat starts
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: MessageRole.User,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Create placeholder for AI response
    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder: Message = {
      id: botMessageId,
      role: MessageRole.Model,
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
      const streamResponse = await sendMessageToGeminiStream(userMessage.content);
      
      let fullText = '';
      
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
            fullText += text;
            setMessages(prev => prev.map(msg => 
                msg.id === botMessageId 
                ? { ...msg, content: fullText }
                : msg
            ));
        }
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
        ? { ...msg, content: "❌ **Erro de Sistema:** Não foi possível conectar ao núcleo da Neon X Hub. Verifique sua conexão ou tente novamente." }
        : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-hub-dark text-gray-200 font-sans selection:bg-neon-purple/30 selection:text-white">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-10 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onNewChat={handleNewChat} />

      <main className="flex-1 flex flex-col h-full relative w-full">
        {/* Top Bar (Mobile/Tablet) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-hub-border bg-hub-panel">
          <div className="flex items-center gap-2">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white">
                <Menu size={20} />
             </button>
             <span className="font-bold text-neon-cyan tracking-wider text-sm">NEON X HUB</span>
          </div>
          <button onClick={handleNewChat} className="p-2 text-neon-purple">
            <RefreshCw size={18} />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-6 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === MessageRole.User ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar for Bot */}
                {msg.role === MessageRole.Model && (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-neon-purple to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/50 mt-1">
                    <Sparkles size={16} className="text-white animate-pulse" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`
                    relative max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-lg
                    ${msg.role === MessageRole.User 
                      ? 'bg-neon-purple/10 border border-neon-purple/30 text-white rounded-br-none' 
                      : 'bg-[#13131f] border border-hub-border/50 text-gray-100 rounded-bl-none'}
                  `}
                >
                  {/* Glowing effect for User messages */}
                  {msg.role === MessageRole.User && (
                     <div className="absolute inset-0 bg-neon-purple/5 blur-xl rounded-2xl -z-10"></div>
                  )}

                  <MarkdownRenderer content={msg.content} />
                  
                  {msg.role === MessageRole.Model && msg.content === '' && (
                     <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-0"></div>
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-150"></div>
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-300"></div>
                     </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-hub-border/50 bg-hub-dark/95 backdrop-blur z-10">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-20 blur-lg rounded-xl -z-10"></div>
            <div className="relative bg-[#1a1a24] border border-hub-border rounded-xl flex items-end shadow-2xl overflow-hidden focus-within:border-neon-cyan/50 focus-within:ring-1 focus-within:ring-neon-cyan/30 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre Lua, Roblox API ou cole um script para análise..."
                className="w-full bg-transparent text-gray-200 placeholder-gray-500 p-4 max-h-48 min-h-[56px] resize-none focus:outline-none font-mono text-sm leading-relaxed"
                rows={1}
                disabled={isLoading}
              />
              <div className="p-2 pb-3 pr-3">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`
                    p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                    ${!input.trim() || isLoading 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-neon-blue to-neon-cyan text-black font-bold hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transform hover:-translate-y-0.5'}
                  `}
                >
                  {isLoading ? <StopCircle size={20} className="animate-pulse" /> : <Send size={20} />}
                </button>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-[10px] text-gray-500 font-mono">
                Neon X Hub IA pode cometer erros. Revise o código antes de usar em produção.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;