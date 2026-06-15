import { useState, useEffect } from 'react';
import { ChevronLeft, Check, Ghost, Plus, Trash2, X } from 'lucide-react';
import { THEMES, type Theme, type ImpostorScenario } from './data';
import { triggerVibration } from '../utils/syncService';

type Props = {
  onBack: () => void;
  onStart: (themes: Theme[]) => void;
};

export default function ThemeSelectionImpostor({ onBack, onStart }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  
  // Single Scenario Draft
  const [honestText, setHonestText] = useState('');
  const [impostorText, setImpostorText] = useState('');
  const [scenariosList, setScenariosList] = useState<ImpostorScenario[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Carrega do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('impostor_custom_themes');
    if (saved) {
      try {
        setCustomThemes(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const toggleTheme = (id: string) => {
    triggerVibration(50);
    setSelectedIds((prev) => {
      let next = [...prev];
      if (next.includes(id)) next = next.filter((tid) => tid !== id);
      else next.push(id);
      return next;
    });
  };

  const handleDeleteTheme = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerVibration([50, 50]);
    const filtered = customThemes.filter(t => t.id !== id);
    setCustomThemes(filtered);
    localStorage.setItem('impostor_custom_themes', JSON.stringify(filtered));
    localStorage.removeItem('impostor_custom_scenarios_' + id);

    setSelectedIds(prev => prev.filter(tid => tid !== id));
  };

  const handleAddScenario = () => {
    if (!honestText.trim() || !impostorText.trim()) {
      setErrorMsg('Preencha a frase do grupo e do impostor.');
      return;
    }
    
    const variations = impostorText
      .split('\n')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const newScenario: ImpostorScenario = {
      honest: honestText.trim(),
      impostorVariations: variations
    };

    setScenariosList([...scenariosList, newScenario]);
    setHonestText('');
    setImpostorText('');
    setErrorMsg('');
    triggerVibration(60);
  };

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!themeName.trim()) {
      setErrorMsg('O nome do tema é obrigatório.');
      return;
    }

    let finalScenarios = [...scenariosList];
    if (honestText.trim() && impostorText.trim()) {
      const variations = impostorText
        .split('\n')
        .map(v => v.trim())
        .filter(v => v.length > 0);
      finalScenarios.push({
        honest: honestText.trim(),
        impostorVariations: variations
      });
    }

    if (finalScenarios.length === 0) {
      setErrorMsg('Adicione pelo menos 1 pergunta/cenário.');
      return;
    }

    const themeId = `custom_theme_${Date.now()}`;
    const newTheme: Theme = {
      id: themeId,
      name: themeName.trim(),
      description: themeDescription.trim() || 'Tema personalizado criado por você.',
      icon: Ghost,
      color: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    };

    localStorage.setItem('impostor_custom_scenarios_' + themeId, JSON.stringify(finalScenarios));
    
    const updatedThemes = [...customThemes, newTheme];
    setCustomThemes(updatedThemes);
    localStorage.setItem('impostor_custom_themes', JSON.stringify(updatedThemes));

    // Seleciona automaticamente o novo tema
    setSelectedIds([...selectedIds, themeId]);

    // Reset form e fecha modal
    setThemeName('');
    setThemeDescription('');
    setHonestText('');
    setImpostorText('');
    setScenariosList([]);
    setShowModal(false);
    triggerVibration(100);
  };

  const allThemes = [...THEMES, ...customThemes];
  const selectedThemes = allThemes.filter((t) => selectedIds.includes(t.id));

  return (
    <div className="flex-1 flex flex-col bg-slate-955 relative h-full overflow-hidden text-slate-100 font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-purple-400 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="ml-4">
          <h2 className="font-black text-xl text-white font-outfit">Temas (Impostor)</h2>
          <p className="text-xs text-slate-455 font-medium">Escolha os contextos das perguntas</p>
        </div>
      </div>

      {/* Área Central Rolável */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-4">
        {allThemes.map((theme) => {
          if (theme.id === 'free') return null; // Impostor precisa de perguntas prontas
          
          const Icon = theme.icon;
          const isSelected = selectedIds.includes(theme.id);
          const isCustom = theme.id.startsWith('custom_theme_');

          return (
            <div
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`w-full group text-left relative overflow-hidden rounded-3xl p-5 shadow-lg transition-all duration-200 border-2 flex items-center gap-4 cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 border-purple-500 ring-4 ring-purple-900/40 scale-[1.01]' 
                  : 'bg-slate-900/50 border-white/5 hover:border-slate-800'
              }`}
            >
              <div className={`p-3.5 rounded-2xl ${theme.color} text-slate-950 shadow-sm shrink-0 opacity-90`}>
                <Icon size={24} className={isCustom ? 'text-purple-400' : 'text-slate-950'} />
              </div>
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-black text-lg text-white font-outfit">{theme.name}</h3>
                  {isCustom && (
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-outfit">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-slate-450 font-medium text-xs sm:text-sm leading-relaxed">{theme.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {isCustom && (
                  <button
                    onClick={(e) => handleDeleteTheme(theme.id, e)}
                    className="p-2 bg-red-955/20 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all scale-95 opacity-85 hover:opacity-100 z-25"
                    title="Excluir tema"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-slate-700 bg-slate-900'}`}>
                  {isSelected && <Check size={14} className="text-white stroke-[3px]" />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Botão de Novo Tema */}
        <button
          onClick={() => { setShowModal(true); triggerVibration(50); }}
          className="w-full p-5 rounded-3xl border-2 border-dashed border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/[0.02] text-center text-purple-400 font-bold transition-all flex items-center justify-center gap-2 font-outfit mt-2"
        >
          <Plus size={20} />
          <span>CRIAR TEMA PERSONALIZADO</span>
        </button>
      </div>

      {/* Rodapé Fixo Flex */}
      <div className="p-6 bg-slate-955 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.2)]">
        <button
          onClick={() => onStart(selectedThemes)}
          disabled={selectedIds.length === 0}
          className="w-full bg-purple-650 hover:bg-purple-600 disabled:bg-slate-900 disabled:text-slate-655 text-white font-black text-lg py-4 rounded-2xl shadow-md hover:shadow-lg disabled:shadow-none transition-all duration-150 active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 font-outfit"
        >
          <span>INICIAR IMPOSTOR</span> <Ghost size={20} fill="currentColor" />
        </button>
      </div>

      {/* Modal para Criação de Tema Customizado */}
      {showModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 max-w-sm w-full mx-auto shadow-2xl relative animate-fade-in-scale max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-300 z-10"
            >
              <X size={20} />
            </button>
            
            <div className="mb-4">
              <h3 className="text-xl font-black text-white font-outfit">Novo Tema (Impostor)</h3>
              <p className="text-slate-450 text-xs mt-0.5 font-medium">Adicione cenários divertidos com palavras parecidas.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-955/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold mb-4 font-outfit text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTheme} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 font-outfit">Nome do Tema</label>
                <input
                  type="text"
                  placeholder="Ex: Nossas Viagens, Segredos"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value.slice(0, 24))}
                  className="w-full bg-slate-950 border border-white/10 px-4 py-3 rounded-xl text-white font-bold placeholder:text-slate-700 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-900/10 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 font-outfit">Descrição (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Perguntas sobre nossas histórias internas..."
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value.slice(0, 60))}
                  className="w-full bg-slate-950 border border-white/10 px-4 py-3 rounded-xl text-white font-bold placeholder:text-slate-700 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-900/10 transition-all text-sm"
                />
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="block text-[9px] font-black text-purple-400 uppercase tracking-widest font-outfit">
                  Adicionar Pergunta ({scenariosList.length} adicionadas)
                </span>
                
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 mb-1 font-outfit">Palavra do Grupo Honesto</label>
                  <input
                    type="text"
                    placeholder="Ex: Cachorro"
                    value={honestText}
                    onChange={(e) => setHonestText(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 px-3 py-2 rounded-lg text-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-450 mb-1 font-outfit">Variações do Impostor (Uma por linha)</label>
                  <textarea
                    placeholder="Ex:&#10;Lobo&#10;Gato&#10;Leão"
                    value={impostorText}
                    onChange={(e) => setImpostorText(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-white/10 px-3 py-2 rounded-lg text-white text-xs font-bold resize-none font-sans"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddScenario}
                  className="w-full py-2 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-650 text-purple-200 font-bold rounded-lg text-xs font-outfit uppercase"
                >
                  + Adicionar Pergunta
                </button>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-slate-950 border border-white/10 hover:bg-slate-855 text-slate-350 font-bold rounded-xl text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-550 text-white font-black rounded-xl text-sm transition-all shadow-md font-outfit"
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