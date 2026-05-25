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
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-purple-400 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="ml-4">
          <h2 className="font-black text-xl text-white font-outfit">Temas (Impostor)</h2>
          <p className="text-xs text-slate-450 font-medium">Escolha os contextos das perguntas</p>
        </div>
      </div>

      {/* Área Central Rolável (Sem sobreposições) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-4">
        {THEMES.map((theme) => {
           // Filtra o tema "Free" se quiser, pois impostor precisa de perguntas prontas
           if (theme.id === 'free') return null; 
           
          const Icon = theme.icon;
          const isSelected = selectedIds.includes(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`w-full group text-left relative overflow-hidden rounded-3xl p-5 shadow-lg transition-all duration-200 border-2 ${
                isSelected 
                  ? 'bg-slate-900 border-purple-500 ring-4 ring-purple-900/40 scale-[1.01]' 
                  : 'bg-slate-900/50 border-white/5 hover:border-slate-800'
              }`}
            >
              <div className={`absolute top-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-slate-700 bg-slate-900'}`}>
                {isSelected && <Check size={14} className="text-white stroke-[3px]" />}
              </div>
              <div className="flex items-start gap-4 relative z-10 pr-8">
                <div className={`p-3.5 rounded-2xl ${theme.color} text-slate-950 shadow-sm shrink-0 opacity-90`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-white mb-0.5 font-outfit">{theme.name}</h3>
                  <p className="text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">{theme.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Rodapé Fixo Flex */}
      <div className="p-6 bg-slate-950 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedIds.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-900 disabled:text-slate-600 text-white font-black text-lg py-4 rounded-2xl shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-150 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 font-outfit"
        >
          <span>INICIAR IMPOSTOR</span> <Ghost size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}