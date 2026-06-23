import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, UserSearch, X } from 'lucide-react';
import { WHOAMI_THEMES, type WhoAmITheme } from './data';
import { triggerVibration } from '../utils/syncService';

type Props = {
  onBack: () => void;
  onStart: (themes: WhoAmITheme[]) => void;
};

export default function ThemeSelectionWhoAmI({ onBack, onStart }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['cultura-pop']));
  const [customThemes, setCustomThemes] = useState<WhoAmITheme[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [personalitiesText, setPersonalitiesText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Carrega temas customizados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('whoami_custom_themes');
    if (saved) {
      try {
        setCustomThemes(JSON.parse(saved));
      } catch (err) {
        console.error('Erro ao carregar temas customizados:', err);
      }
    }
  }, []);

  const toggleTheme = (id: string) => {
    triggerVibration(50);
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDeleteTheme = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerVibration([50, 50]);
    const filtered = customThemes.filter(t => t.id !== id);
    setCustomThemes(filtered);
    localStorage.setItem('whoami_custom_themes', JSON.stringify(filtered));
    localStorage.removeItem('whoami_custom_personalities_' + id);

    const newSet = new Set(selectedIds);
    newSet.delete(id);
    setSelectedIds(newSet);
  };

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!themeName.trim()) {
      setErrorMsg('O nome do tema é obrigatório.');
      return;
    }

    const items = personalitiesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (items.length < 5) {
      setErrorMsg('Insira pelo menos 5 personagens (um por linha).');
      return;
    }

    const themeId = `custom_theme_${Date.now()}`;
    const newTheme: WhoAmITheme = {
      id: themeId,
      name: themeName.trim(),
      description: themeDescription.trim() || 'Tema personalizado criado por você.',
      color: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      icon: UserSearch,
      personalities: items // mantido para compatibilidade local
    };

    // Salva personagens separadamente e também no tema para fallback rápido
    localStorage.setItem('whoami_custom_personalities_' + themeId, JSON.stringify(items));
    
    const updatedThemes = [...customThemes, newTheme];
    setCustomThemes(updatedThemes);
    localStorage.setItem('whoami_custom_themes', JSON.stringify(updatedThemes));

    // Seleciona automaticamente o novo tema criado
    const newSet = new Set(selectedIds);
    newSet.add(themeId);
    setSelectedIds(newSet);

    // Reset form e fecha modal
    setThemeName('');
    setThemeDescription('');
    setPersonalitiesText('');
    setShowModal(false);
    triggerVibration(100);
  };

  const allThemes = [...WHOAMI_THEMES, ...customThemes];
  const selectedThemes = allThemes.filter(t => selectedIds.has(t.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-955 relative h-full overflow-hidden text-slate-100 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} aria-label="Voltar" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-emerald-400 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Temas (Quem Sou Eu)</span>
      </div>

      {/* Área Central Rolável */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {allThemes.map((theme) => {
          const isSelected = selectedIds.has(theme.id);
          const Icon = theme.icon;
          const isCustom = theme.id.startsWith('custom_theme_');

          return (
            <div
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`p-5 rounded-3xl border-2 text-left transition-all duration-200 flex items-center gap-4 shadow-md cursor-pointer relative group ${
                isSelected 
                  ? 'border-emerald-500 bg-slate-900 ring-4 ring-emerald-900/30 scale-[1.01]' 
                  : 'border-white/5 bg-slate-900/40 hover:bg-slate-900 opacity-80 hover:opacity-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme.color} ${theme.textColor} shadow-inner`}>
                <Icon size={24} />
              </div>
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-black text-white font-outfit">{theme.name}</h3>
                  {isCustom && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-outfit">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-450 leading-relaxed font-medium">{theme.description}</p>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {isCustom && (
                  <button
                    onClick={(e) => handleDeleteTheme(theme.id, e)}
                    className="p-2 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all scale-95 opacity-85 hover:opacity-100"
                    title="Excluir tema"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-650'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Botão para Criar Tema */}
        <button
          onClick={() => { setShowModal(true); triggerVibration(50); }}
          className="p-5 rounded-3xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/[0.02] text-center text-emerald-400 font-bold transition-all flex items-center justify-center gap-2 font-outfit mt-2"
        >
          <Plus size={20} />
          <span>CRIAR TEMA PERSONALIZADO</span>
        </button>
      </div>

      {/* Rodapé Fixo */}
      <div className="p-6 bg-slate-955 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedThemes.length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-455 disabled:bg-slate-900 disabled:text-slate-650 disabled:shadow-none text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit"
        >
          <span>COMEÇAR JOGO</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
        {selectedThemes.length === 0 && (
          <p className="text-center text-red-400 text-xs mt-3 font-bold font-outfit animate-pulse">
            Selecione pelo menos um tema
          </p>
        )}
      </div>

      {/* Modal para Criação de Tema Customizado (Aparência Premium Glassmorphism) */}
      {showModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 max-w-sm w-full mx-auto shadow-2xl relative animate-fade-in-scale max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-300"
            >
              <X size={20} />
            </button>
            
            <div className="mb-4">
              <h3 className="text-xl font-black text-white font-outfit">Novo Tema</h3>
              <p className="text-slate-450 text-xs mt-0.5 font-medium">Crie seus próprios personagens para adivinhar.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold mb-4 font-outfit text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTheme} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 font-outfit">Nome do Tema</label>
                <input
                  type="text"
                  placeholder="Ex: Colegas de Trabalho, Séries Anos 90"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value.slice(0, 24))}
                  className="w-full bg-slate-950 border border-white/10 px-4 py-3 rounded-xl text-white font-bold placeholder:text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/10 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 font-outfit">Descrição (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Apenas personagens e piadas internas..."
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value.slice(0, 60))}
                  className="w-full bg-slate-950 border border-white/10 px-4 py-3 rounded-xl text-white font-bold placeholder:text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/10 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 font-outfit">Personagens (Um por linha, mín. 5)</label>
                <textarea
                  placeholder="Ex:&#10;Batman&#10;Neymar&#10;Seu Madruga&#10;Professor Girafales&#10;Harry Potter"
                  value={personalitiesText}
                  onChange={(e) => setPersonalitiesText(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-white/10 px-4 py-3 rounded-xl text-white font-bold placeholder:text-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-900/10 transition-all text-sm resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-slate-950 border border-white/10 hover:bg-slate-850 text-slate-350 font-bold rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-450 text-white font-black rounded-xl text-sm transition-all shadow-md font-outfit"
                >
                  Salvar Tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
