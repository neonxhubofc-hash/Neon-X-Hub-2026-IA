import React from 'react';
import { Bot, Zap, Code2, Info, ExternalLink } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNewChat }) => {
  return (
    <aside 
      className={`
        fixed md:relative z-20 h-full bg-hub-panel border-r border-hub-border flex flex-col transition-all duration-300
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-64 md:translate-x-0 overflow-hidden'}
      `}
    >
      {/* Header / Branding */}
      <div className="p-6 border-b border-hub-border/50 bg-gradient-to-b from-hub-panel to-hub-dark">
        <div className="flex items-center gap-3 mb-1">
          <div className="relative">
            <div className="absolute inset-0 bg-neon-purple blur opacity-50 rounded-full"></div>
            <Bot size={32} className="relative text-white z-10" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight leading-none">
              NEON X <span className="text-neon-cyan">HUB</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
              Powered by Ressel
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-neon-purple/10 border border-neon-purple/20 hover:bg-neon-purple/20 hover:border-neon-purple/50 text-white rounded-lg transition-all duration-200 group"
        >
          <Zap size={18} className="text-neon-purple group-hover:text-white transition-colors" />
          <span className="font-medium text-sm">Nova Análise</span>
        </button>

        <div className="mt-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Especialidades</h3>
          <ul className="space-y-1">
            <li className="px-3 py-2 text-gray-400 text-sm flex items-center gap-2 hover:bg-white/5 rounded cursor-default">
              <Code2 size={14} className="text-neon-cyan" /> Lua / Luau Expert
            </li>
            <li className="px-3 py-2 text-gray-400 text-sm flex items-center gap-2 hover:bg-white/5 rounded cursor-default">
              <Code2 size={14} className="text-neon-cyan" /> Roblox API
            </li>
            <li className="px-3 py-2 text-gray-400 text-sm flex items-center gap-2 hover:bg-white/5 rounded cursor-default">
              <Code2 size={14} className="text-neon-cyan" /> Otimização
            </li>
          </ul>
        </div>
        
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-transparent border border-white/5">
            <p className="text-xs text-gray-300 leading-relaxed mb-2">
               "A tecnologia é a magia do futuro."
            </p>
            <p className="text-[10px] text-neon-cyan text-right font-mono">- Poderoso Hub ⚡</p>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-hub-border/50">
        <div className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
          <Info size={14} />
          <span>v2.5.0 • Stable Build</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-neon-blue hover:text-neon-cyan cursor-pointer transition-colors">
            <ExternalLink size={12} />
            <span>Documentação Roblox</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;