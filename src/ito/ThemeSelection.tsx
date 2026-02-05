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
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <div className="p-4 flex items-center bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4 safe-top">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <div className="ml-4">
          <h2 className="font-bold text-lg text-slate-800">Temas (Clássico)</h2>
          <p className="text-xs text-slate-500">Escolha sobre o que vamos debater</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedIds.includes(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`w-full group text-left relative overflow-hidden rounded-3xl p-6 shadow-md transition-all duration-200 border-2 ${
                isSelected ? 'bg-white border-yellow-400 ring-4 ring-yellow-100 scale-[1.02]' : 'bg-white border-transparent hover:border-slate-200'
              }`}
            >
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${isSelected ? 'bg-yellow-400 border-yellow-400' : 'border-slate-300 bg-white'}`}>
                {isSelected && <Check size={14} className="text-black" />}
              </div>
              <div className="flex items-start gap-4 relative z-10 pr-6">
                <div className={`p-4 rounded-2xl ${theme.color} ${theme.textColor} shadow-sm`}>
                  <Icon size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-slate-800 mb-1">{theme.name}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{theme.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 safe-bottom">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedIds.length === 0}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-200 disabled:text-slate-400 text-black font-black text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span>INICIAR JOGO</span> <Play size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}