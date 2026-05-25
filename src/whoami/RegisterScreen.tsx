import { useState } from 'react';
import { ChevronLeft, Plus, Trash2, UserSearch } from 'lucide-react';

type Props = {
  onBack: () => void;
  onNext: (players: string[]) => void;
};

export default function RegisterScreenWhoAmI({ onBack, onNext }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    const v = inputValue.trim();
    if (!v) return;
    setLocalPlayers((prev) => [...prev, v]);
    setInputValue('');
  };

  const removePlayer = (index: number) => {
    setLocalPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-emerald-400 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Jogadores (Quem Sou Eu)</span>
      </div>

      {/* Área Central Flexível */}
      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        {/* Input Area (Fixada) */}
        <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 shadow-xl mb-6 shrink-0 animate-fade-in-scale">
          <label className="block text-emerald-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider font-outfit">Novo Participante</label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Digite o nome"
              className="flex-1 bg-slate-955 border border-white/5 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
            />
            <button 
              onClick={addPlayer} 
              disabled={!inputValue.trim()} 
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-2xl p-3.5 shadow-md active:scale-95 disabled:scale-100 transition-all duration-150"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* List Area com Scroll */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1">
          {localPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 animate-fade-in">
              <div className="w-16 h-16 bg-slate-900/60 rounded-full flex items-center justify-center mb-3 border border-white/5">
                <UserSearch size={32} className="text-emerald-400 opacity-60 animate-pulse" />
              </div>
              <p className="font-bold text-slate-400 text-sm">Adicione pelo menos 2 jogadores</p>
              <p className="text-xs text-slate-550 mt-1">Quem será o primeiro a adivinhar?</p>
            </div>
          ) : (
            localPlayers.map((player, index) => (
              <div key={`${player}-${index}`} className="flex items-center justify-between bg-slate-900/30 p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all duration-200 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm select-none">
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-200 text-base">{player}</span>
                </div>
                <button onClick={() => removePlayer(index)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-150">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rodapé Fixo */}
      <div className="p-6 bg-slate-950 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => onNext(localPlayers)}
          disabled={localPlayers.length < 2}
          className="w-full bg-white hover:bg-slate-200 disabled:bg-slate-900 disabled:text-slate-600 text-slate-955 font-black text-lg py-4 rounded-2xl shadow-lg transition-all duration-150 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 font-outfit"
        >
          <span>AVANÇAR</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
        {localPlayers.length > 0 && localPlayers.length < 2 && (
           <p className="text-center text-red-400 text-xs mt-3 font-bold font-outfit">Precisa de pelo menos 2 jogadores</p>
        )}
      </div>
    </div>
  );
}
