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
    <div className="flex-1 flex flex-col bg-teal-900 relative h-full text-white">
      {/* Header */}
      <div className="p-4 flex items-center bg-teal-900 shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top border-b border-teal-800">
        <button onClick={onBack} className="p-2 hover:bg-teal-800 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-emerald-400" />
        </button>
        <span className="ml-4 font-bold text-lg text-white">Temas (Quem Sou Eu)</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {WHOAMI_THEMES.map((theme) => {
          const isSelected = selectedIds.has(theme.id);
          const Icon = theme.icon;

          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`p-5 rounded-3xl border-4 text-left transition-all duration-200 flex items-center gap-4 ${
                isSelected 
                  ? 'border-emerald-400 bg-teal-800 shadow-lg transform scale-[1.02]' 
                  : 'border-transparent bg-teal-800/50 hover:bg-teal-800 opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme.color} ${theme.textColor}`}>
                <Icon size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 text-white">{theme.name}</h3>
                <p className="text-sm opacity-80 text-teal-200 leading-snug">{theme.description}</p>
              </div>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-teal-600'
              }`}>
                {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-6 bg-teal-900 border-t border-teal-800 shrink-0 safe-bottom">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedThemes.length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-teal-800 disabled:text-teal-600 disabled:shadow-none text-white font-black text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          COMEÇAR JOGO <ChevronLeft className="rotate-180" size={24} />
        </button>
        {selectedThemes.length === 0 && (
          <p className="text-center text-teal-400 text-xs mt-3 font-bold">
            Selecione pelo menos um tema
          </p>
        )}
      </div>
    </div>
  );
}
