import { useState } from 'react';
import { ChevronLeft, Check, Ghost } from 'lucide-react';
import { THEMES, type Theme } from './data';

type Props = {
  onBack: () => void;
  onStart: (themes: Theme[]) => void;
};

export default function ThemeSelectionImpostor({ onBack, onStart }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleTheme = (id: string) => {
    // Impostor mode: Talvez não tenha "Free" (livre), ou funcione diferente.
    // Por enquanto mantemos a mesma lógica de seleção.
    setSelectedIds((prev) => {
      let next = [...prev];
      if (next.includes(id)) next = next.filter((tid) => tid !== id);
      else next.push(id);
      return next;
    });
  };

  const selectedThemes = THEMES.filter((t) => selectedIds.includes(t.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-900 relative h-full text-white">
      <div className="p-4 flex items-center bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4 safe-top border-b border-slate-800">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
          <ChevronLeft size={24} className="text-purple-400" />
        </button>
        <div className="ml-4">
          <h2 className="font-bold text-lg text-white">Temas (Impostor)</h2>
          <p className="text-xs text-slate-400">Escolha os contextos das perguntas</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
        {THEMES.map((theme) => {
           // Filtra o tema "Free" se quiser, pois impostor precisa de perguntas prontas
           if (theme.id === 'free') return null; 
           
          const Icon = theme.icon;
          const isSelected = selectedIds.includes(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`w-full group text-left relative overflow-hidden rounded-3xl p-6 shadow-md transition-all duration-200 border-2 ${
                isSelected 
                  ? 'bg-slate-800 border-purple-500 ring-4 ring-purple-900/50 scale-[1.02]' 
                  : 'bg-slate-800 border-transparent hover:border-slate-700'
              }`}
            >
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-slate-600 bg-slate-800'}`}>
                {isSelected && <Check size={14} className="text-white" />}
              </div>
              <div className="flex items-start gap-4 relative z-10 pr-6">
                <div className={`p-4 rounded-2xl ${theme.color} text-slate-900 shadow-sm opacity-90`}>
                  <Icon size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-white mb-1">{theme.name}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{theme.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-slate-800 safe-bottom">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedIds.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span>INICIAR IMPOSTOR</span> <Ghost size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}