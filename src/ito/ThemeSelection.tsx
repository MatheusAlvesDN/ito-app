import { useState } from 'react';
import { ChevronLeft, Check, Play } from 'lucide-react';
import { THEMES, type Theme } from './data';

type Props = {
  onBack: () => void;
  onStart: (themes: Theme[]) => void;
};

export default function ThemeSelectionClassic({ onBack, onStart }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleTheme = (id: string) => {
    if (id === 'free') {
      setSelectedIds((prev) => (prev.includes('free') ? [] : ['free']));
      return;
    }
    setSelectedIds((prev) => {
      let next = [...prev];
      if (next.includes('free')) next = [];
      if (next.includes(id)) next = next.filter((tid) => tid !== id);
      else next.push(id);
      return next;
    });
  };

  const selectedThemes = THEMES.filter((t) => selectedIds.includes(t.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full overflow-hidden text-slate-800 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-white/95 border-b border-slate-100 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="ml-4">
          <h2 className="font-black text-xl text-slate-800 font-outfit">Temas (Clássico)</h2>
          <p className="text-xs text-slate-400 font-medium">Escolha sobre o que vamos debater</p>
        </div>
      </div>

      {/* Área Central Rolável (Sem cortes) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-4">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedIds.includes(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`w-full group text-left relative overflow-hidden rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border-2 ${
                isSelected 
                  ? 'bg-white border-yellow-400 ring-4 ring-yellow-100/50 scale-[1.01]' 
                  : 'bg-white border-slate-200/60 hover:border-slate-300'
              }`}
            >
              <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${isSelected ? 'bg-yellow-400 border-yellow-400' : 'border-slate-300 bg-white'}`}>
                {isSelected && <Check size={14} className="text-black stroke-[3px]" />}
              </div>
              <div className="flex items-start gap-4 relative z-10 pr-8">
                <div className={`p-3.5 rounded-2xl ${theme.color} ${theme.textColor} shadow-sm shrink-0`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-slate-800 mb-0.5 font-outfit">{theme.name}</h3>
                  <p className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">{theme.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Rodapé Fixo Flex (Nunca posicionado de forma absoluta) */}
      <div className="p-6 bg-white border-t border-slate-100 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedIds.length === 0}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-100 disabled:text-slate-300 text-black font-black text-lg py-4 rounded-2xl shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-150 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 font-outfit"
        >
          <span>INICIAR JOGO</span> <Play size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}