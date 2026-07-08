import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Users, X } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  onBack: () => void;
  onNext: (players: string[]) => void;
};

export default function RegisterScreenClassic({ onBack, onNext }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);
  const [savedHistory, setSavedHistory] = useState<string[]>([]);

  // Carrega jogadores do localStorage ao montar o componente
  useEffect(() => {
    const saved = localStorage.getItem('ito_saved_players');
    if (saved) {
      try {
        setSavedHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const addPlayer = () => {
    const v = inputValue.trim();
    if (!v) return;
    if (localPlayers.includes(v)) return; // Evita duplicar no jogo atual
    if (localPlayers.length >= 20) {
      toast.error('Limite máximo de 20 jogadores atingido.');
      return;
    }
    setLocalPlayers((prev) => [...prev, v]);
    setInputValue('');
  };

  const removePlayer = (index: number) => {
    setLocalPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePlayerFromHistory = (player: string) => {
    if (localPlayers.includes(player)) {
      setLocalPlayers((prev) => prev.filter((p) => p !== player));
    } else {
      if (localPlayers.length >= 20) {
        toast.error('Limite máximo de 20 jogadores atingido.');
        return;
      }
      setLocalPlayers((prev) => [...prev, player]);
    }
  };

  const deleteFromHistory = (player: string) => {
    const updatedHistory = savedHistory.filter((p) => p !== player);
    setSavedHistory(updatedHistory);
    localStorage.setItem('ito_saved_players', JSON.stringify(updatedHistory));
  };

  const handleNext = () => {
    // Salva no histórico de forma cumulativa
    const newHistory = Array.from(new Set([...savedHistory, ...localPlayers]));
    localStorage.setItem('ito_saved_players', JSON.stringify(newHistory));
    onNext(localPlayers);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full overflow-hidden text-slate-800 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} aria-label="Voltar" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-slate-800 font-outfit">Jogadores (Clássico)</span>
      </div>

      {/* Área Central Flexível */}
      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        {/* Input Area (Fixada no Topo da Área Central) */}
        <div className="bg-white p-5 rounded-3xl shadow-md mb-6 border border-slate-100/80 shrink-0 animate-fade-in-scale">
          <label className="block text-slate-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider font-outfit">Novo Participante</label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Digite o nome"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white outline-none transition-all duration-200"
            />
            <button 
              onClick={addPlayer} 
              disabled={!inputValue.trim()}
              aria-label="Adicionar jogador"
              className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-100 disabled:text-slate-300 text-slate-955 rounded-2xl p-3.5 shadow-md active:scale-95 disabled:scale-100 transition-all duration-150"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Jogadores Salvos / Histórico */}
        {savedHistory.length > 0 && (
          <div className="mb-6 shrink-0 animate-fade-in">
            <span className="block text-slate-400 font-bold mb-2 ml-1 text-[11px] uppercase tracking-wider font-outfit">Rápida Seleção / Histórico</span>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 pb-1">
              {savedHistory.map((player) => {
                const isSelected = localPlayers.includes(player);
                return (
                  <div
                    key={`history-${player}`}
                    onClick={() => togglePlayerFromHistory(player)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? 'bg-yellow-400 border-yellow-400 text-slate-950 shadow-md shadow-yellow-400/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{player}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFromHistory(player);
                      }}
                      aria-label="Remover do histórico"
                      className={`p-0.5 rounded-full transition-colors ${
                        isSelected ? 'hover:bg-yellow-500 text-slate-900' : 'hover:bg-slate-100 text-slate-400'
                      }`}
                      title="Remover do histórico"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List Area (Única com Scroll Vertical) */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1">
          {localPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-300 animate-fade-in">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Users size={32} className="text-slate-400 opacity-60" />
              </div>
              <p className="font-bold text-slate-400 text-sm">Adicione pelo menos 2 jogadores</p>
              <p className="text-xs text-slate-400/80 mt-1">Quanto mais pessoas, mais divertido!</p>
            </div>
          ) : (
            localPlayers.map((player, index) => (
              <div key={`${player}-${index}`} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-yellow-300/50 transition-all duration-200 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center text-black font-black text-sm shadow-sm select-none">
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700 text-base">{player}</span>
                </div>
                <button onClick={() => removePlayer(index)} aria-label="Remover jogador" className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rodapé Fixo Flex (Nunca posicionado de forma absoluta) */}
      <div className="p-6 bg-white border-t border-slate-100 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.02)]">
        <button
          onClick={handleNext}
          disabled={localPlayers.length < 2}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-150 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 font-outfit"
        >
          <span>AVANÇAR</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
      </div>
    </div>
  );
}