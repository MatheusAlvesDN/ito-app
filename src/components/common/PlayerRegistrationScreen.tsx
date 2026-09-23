import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Users, X } from 'lucide-react';

export type AccentColor = 'yellow' | 'purple' | 'emerald' | 'rose';

interface Props {
  title: string;
  onBack: () => void;
  onNext: (players: string[]) => void;
  accentColor?: AccentColor;
  minPlayers?: number;
  storageKey?: string;
}

const COLOR_STYLES: Record<
  AccentColor,
  {
    backBtn: string;
    focusRing: string;
    addBtn: string;
    chipSelected: string;
    chipHover: string;
    chipDelete: string;
    avatarGradient: string;
    itemHover: string;
  }
> = {
  yellow: {
    backBtn: 'text-yellow-400',
    focusRing: 'focus:ring-yellow-400 focus:border-yellow-400',
    addBtn: 'bg-yellow-400 hover:bg-yellow-300 text-slate-950',
    chipSelected: 'bg-yellow-400 border-yellow-400 text-slate-950 shadow-yellow-400/20',
    chipHover: 'hover:border-yellow-400/50',
    chipDelete: 'hover:bg-yellow-500 text-slate-900',
    avatarGradient: 'from-yellow-400 to-amber-500 text-slate-950',
    itemHover: 'hover:border-yellow-400/30',
  },
  purple: {
    backBtn: 'text-purple-400',
    focusRing: 'focus:ring-purple-400 focus:border-purple-400',
    addBtn: 'bg-purple-650 hover:bg-purple-600 text-white',
    chipSelected: 'bg-purple-650 border-purple-500 text-white shadow-purple-500/20',
    chipHover: 'hover:border-purple-400/50',
    chipDelete: 'hover:bg-purple-700 text-white',
    avatarGradient: 'from-purple-500 to-indigo-600 text-white',
    itemHover: 'hover:border-purple-400/30',
  },
  emerald: {
    backBtn: 'text-emerald-400',
    focusRing: 'focus:ring-emerald-400 focus:border-emerald-400',
    addBtn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    chipSelected: 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-emerald-400/20',
    chipHover: 'hover:border-emerald-400/50',
    chipDelete: 'hover:bg-emerald-600 text-slate-900',
    avatarGradient: 'from-emerald-400 to-teal-600 text-slate-950',
    itemHover: 'hover:border-emerald-400/30',
  },
  rose: {
    backBtn: 'text-rose-400',
    focusRing: 'focus:ring-rose-400 focus:border-rose-400',
    addBtn: 'bg-rose-500 hover:bg-rose-400 text-white',
    chipSelected: 'bg-rose-500 border-rose-400 text-white shadow-rose-400/20',
    chipHover: 'hover:border-rose-400/50',
    chipDelete: 'hover:bg-rose-600 text-white',
    avatarGradient: 'from-rose-400 to-pink-600 text-white',
    itemHover: 'hover:border-rose-400/30',
  },
};

export function PlayerRegistrationScreen({
  title,
  onBack,
  onNext,
  accentColor = 'yellow',
  minPlayers = 2,
  storageKey = 'ito_saved_players',
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);
  const [savedHistory, setSavedHistory] = useState<string[]>([]);

  const styles = COLOR_STYLES[accentColor];

  // Carrega jogadores do localStorage ao montar o componente
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSavedHistory(JSON.parse(saved));
      } catch {}
    }
  }, [storageKey]);

  const addPlayer = () => {
    const v = inputValue.trim();
    if (!v) return;
    if (localPlayers.includes(v)) return;
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
      setLocalPlayers((prev) => [...prev, player]);
    }
  };

  const deleteFromHistory = (player: string) => {
    const updatedHistory = savedHistory.filter((p) => p !== player);
    setSavedHistory(updatedHistory);
    localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
  };

  const handleNext = () => {
    const newHistory = Array.from(new Set([...savedHistory, ...localPlayers]));
    localStorage.setItem(storageKey, JSON.stringify(newHistory));
    onNext(localPlayers);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-955 relative h-full overflow-hidden text-slate-100 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className={`p-2 bg-white/5 rounded-full hover:bg-white/10 ${styles.backBtn} transition-colors`}
        >
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">{title}</span>
      </div>

      {/* Área Central Flexível */}
      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        {/* Input Area */}
        <div className="bg-slate-900/60 backdrop-blur-md p-5 rounded-3xl shadow-xl mb-6 border border-white/5 shrink-0 animate-fade-in-scale">
          <label className="block text-slate-450 font-bold mb-2 ml-1 text-xs uppercase tracking-wider font-outfit">
            Novo Participante
          </label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Digite o nome..."
              className={`flex-1 bg-slate-955 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:ring-2 ${styles.focusRing} outline-none transition-all duration-200`}
            />
            <button
              onClick={addPlayer}
              disabled={!inputValue.trim()}
              aria-label="Adicionar jogador"
              className={`${styles.addBtn} disabled:bg-slate-800 disabled:text-slate-600 font-black rounded-2xl p-3.5 shadow-md active:scale-95 disabled:scale-100 transition-all duration-150`}
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Jogadores Salvos / Histórico */}
        {savedHistory.length > 0 && (
          <div className="mb-6 shrink-0 animate-fade-in">
            <span className="block text-slate-450 font-bold mb-2 ml-1 text-[11px] uppercase tracking-wider font-outfit">
              Rápida Seleção / Histórico
            </span>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 pb-1">
              {savedHistory.map((player) => {
                const isSelected = localPlayers.includes(player);
                return (
                  <div
                    key={`history-${player}`}
                    onClick={() => togglePlayerFromHistory(player)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? `${styles.chipSelected} shadow-md`
                        : `bg-slate-900/60 border-white/10 text-slate-350 ${styles.chipHover} hover:text-white`
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
                        isSelected ? styles.chipDelete : 'hover:bg-white/10 text-slate-500'
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

        {/* List Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1">
          {localPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600 animate-fade-in">
              <div className="w-16 h-16 bg-slate-900/60 border border-white/5 rounded-full flex items-center justify-center mb-3">
                <Users size={32} className="text-slate-500" />
              </div>
              <p className="font-bold text-slate-400 text-sm font-outfit">
                Adicione pelo menos {minPlayers} jogadores
              </p>
              <p className="text-xs text-slate-500 mt-1">Quanto mais amigos na roda, mais divertido!</p>
            </div>
          ) : (
            localPlayers.map((player, index) => (
              <div
                key={`${player}-${index}`}
                className={`flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/5 ${styles.itemHover} transition-all duration-200 animate-fade-in`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${styles.avatarGradient} rounded-full flex items-center justify-center font-black text-sm shadow-sm select-none font-outfit`}
                  >
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-white text-base">{player}</span>
                </div>
                <button
                  onClick={() => removePlayer(index)}
                  aria-label="Remover jogador"
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-150"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Rodapé Fixo Flex */}
      <div className="p-6 bg-slate-955 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
        <button
          onClick={handleNext}
          disabled={localPlayers.length < minPlayers}
          className="w-full bg-white hover:bg-slate-200 disabled:bg-slate-900 disabled:text-slate-655 text-slate-955 font-black text-lg py-4 rounded-2xl shadow-lg transition-all duration-150 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 font-outfit"
        >
          <span>AVANÇAR</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
      </div>
    </div>
  );
}
