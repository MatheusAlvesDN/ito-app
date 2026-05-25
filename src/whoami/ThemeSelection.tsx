import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { WHOAMI_THEMES, type WhoAmITheme } from './data';

type Props = {
  onBack: () => void;
  onStart: (themes: WhoAmITheme[]) => void;
};

export default function ThemeSelectionWhoAmI({ onBack, onStart }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['cultura-pop']));

  const toggleTheme = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const selectedThemes = WHOAMI_THEMES.filter(t => selectedIds.has(t.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-emerald-400 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Temas (Quem Sou Eu)</span>
      </div>

      {/* Área Central Rolável */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {WHOAMI_THEMES.map((theme) => {
          const isSelected = selectedIds.has(theme.id);
          const Icon = theme.icon;

          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`p-5 rounded-3xl border-2 text-left transition-all duration-200 flex items-center gap-4 shadow-md ${
                isSelected 
                  ? 'border-emerald-500 bg-slate-900 ring-4 ring-emerald-900/30 scale-[1.01]' 
                  : 'border-white/5 bg-slate-900/40 hover:bg-slate-900 opacity-80 hover:opacity-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme.color} ${theme.textColor} shadow-inner`}>
                <Icon size={24} />
              </div>
              <div className="flex-1 pr-2">
                <h3 className="text-lg font-black mb-0.5 text-white font-outfit">{theme.name}</h3>
                <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-medium">{theme.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-650'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Rodapé Fixo */}
      <div className="p-6 bg-slate-950 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedThemes.length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-450 disabled:bg-slate-900 disabled:text-slate-600 disabled:shadow-none text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit"
        >
          <span>COMEÇAR JOGO</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
        {selectedThemes.length === 0 && (
          <p className="text-center text-red-400 text-xs mt-3 font-bold font-outfit animate-pulse">
            Selecione pelo menos um tema
          </p>
        )}
      </div>
    </div>
  );
}
