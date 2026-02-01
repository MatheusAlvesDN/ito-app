import React, { useState, Suspense } from 'react';
import { Play, ChevronLeft, Settings, Info, Cloud, Plus, Trash2, Users, Check } from 'lucide-react';
import { THEMES, type Theme } from './data';

// Lazy load GameScreen
const GameScreen = React.lazy(() => import('./GameScreen'));

// Tipos para as telas do app
type Screen = 'home' | 'register' | 'theme-selection' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);

  // Fluxo de Navegação
  const handlePlayersConfirmed = (registeredPlayers: string[]) => {
    setPlayers(registeredPlayers);
    setCurrentScreen('theme-selection');
  };

  const handleThemesConfirmed = (themes: Theme[]) => {
    setSelectedThemes(themes);
    setCurrentScreen('game');
  };

  // Função para renderizar a tela atual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onPlay={() => setCurrentScreen('register')} />;
      case 'register':
        return <RegisterScreen onBack={() => setCurrentScreen('home')} onNext={handlePlayersConfirmed} />;
      case 'theme-selection':
        return <ThemeSelectionScreen onBack={() => setCurrentScreen('register')} onStart={handleThemesConfirmed} />;
      case 'game':
        return (
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-bold animate-pulse">Carregando...</div>}>
            <GameScreen onBack={() => setCurrentScreen('home')} players={players} themes={selectedThemes} />
          </Suspense>
        );
      default:
        return <HomeScreen onPlay={() => setCurrentScreen('register')} />;
    }
  };

  return (
    <div className="w-full h-screen bg-white text-slate-900 font-sans overflow-hidden flex flex-col selection:bg-yellow-200">
      {renderScreen()}
    </div>
  );
}

// --- Componentes das Telas ---

// 1. Tela Inicial
const HomeScreen = ({ onPlay }: { onPlay: () => void }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-300 to-sky-100 relative overflow-hidden">
      
      {/* Decoração de Fundo: Nuvens */}
      <div className="absolute top-12 left-[-40px] opacity-80 animate-pulse">
         <Cloud size={120} className="text-white fill-white drop-shadow-sm" />
      </div>
      <div className="absolute top-24 right-[-20px] opacity-60">
         <Cloud size={100} className="text-white fill-white drop-shadow-sm" />
      </div>
      <div className="absolute bottom-32 left-8 opacity-40">
         <Cloud size={64} className="text-white fill-white" />
      </div>

      {/* Cabeçalho / Título */}
      <div className="z-10 flex flex-col items-center mb-16 animate-fade-in-down">
        <h1 className="text-9xl font-black tracking-tighter text-black drop-shadow-sm select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          ITO
        </h1>
        <p className="text-sky-800 mt-2 font-bold tracking-widest text-sm uppercase drop-shadow-sm opacity-70">Mobile Experience</p>
      </div>

      {/* Botão Jogar */}
      <div className="z-10 w-full max-w-xs animate-bounce-subtle">
        <button
          onClick={onPlay}
          className="group w-full bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-bold text-2xl py-6 rounded-full shadow-[0_10px_20px_rgba(250,204,21,0.3)] transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 flex items-center justify-center gap-3 border-b-4 border-yellow-600 active:border-b-0 active:mt-1"
        >
          <Play className="w-8 h-8 fill-black" />
          <span>JOGAR</span>
        </button>
      </div>

      {/* Menu de rodapé simples */}
      <div className="absolute bottom-8 flex gap-6 text-sky-700/60">
        <button className="p-3 hover:bg-white/20 rounded-full transition-colors hover:text-sky-900">
          <Settings size={24} />
        </button>
        <button className="p-3 hover:bg-white/20 rounded-full transition-colors hover:text-sky-900">
          <Info size={24} />
        </button>
      </div>
    </div>
  );
};

// 2. Tela de Cadastro de Jogadores
const RegisterScreen = ({ onBack, onNext }: { onBack: () => void, onNext: (players: string[]) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    if (inputValue.trim()) {
      setLocalPlayers([...localPlayers, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removePlayer = (index: number) => {
    const newPlayers = [...localPlayers];
    newPlayers.splice(index, 1);
    setLocalPlayers(newPlayers);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addPlayer();
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-sky-100 to-white relative">
      {/* Barra superior */}
      <div className="p-4 flex items-center bg-white/50 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white hover:bg-sky-50 rounded-full transition-colors text-sky-900 shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-bold text-lg text-sky-900">Cadastrar Jogadores</span>
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-full">
        {/* Input Card */}
        <div className="bg-white p-4 rounded-3xl shadow-lg shadow-sky-100/50 mb-6">
          <label className="block text-sky-900 font-bold mb-2 ml-1 text-sm">Novo Jogador</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite o nome..."
              className="flex-1 bg-sky-50 border-none rounded-xl px-4 py-3 text-sky-900 placeholder-sky-300 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
            <button 
              onClick={addPlayer}
              disabled={!inputValue.trim()}
              className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl p-3 transition-colors shadow-md"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Lista de Jogadores */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-20">
          {localPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-sky-300 opacity-60">
              <Users size={48} className="mb-2" />
              <p>Nenhum jogador cadastrado</p>
            </div>
          ) : (
            localPlayers.map((player, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-sky-50 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700">{player}</span>
                </div>
                <button 
                  onClick={() => removePlayer(index)}
                  className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botão de Ação */}
      <div className="p-6 bg-white border-t border-sky-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => onNext(localPlayers)}
          disabled={localPlayers.length < 2}
          className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-200 disabled:text-slate-400 text-black font-bold text-xl py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          <span>{localPlayers.length < 2 ? 'Mínimo 2 Jogadores' : 'AVANÇAR'}</span>
          <ChevronLeft className="rotate-180" size={24} />
        </button>
      </div>
    </div>
  );
};

// 3. Tela de Seleção de Temas (Atualizada com Opção LIVRE Exclusiva)
const ThemeSelectionScreen = ({ onBack, onStart }: { onBack: () => void, onStart: (themes: Theme[]) => void }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleTheme = (id: string) => {
    // Regra do modo LIVRE (Exclusivo)
    if (id === 'free') {
      if (selectedIds.includes('free')) {
        setSelectedIds([]); // Desmarca se já estava marcado
      } else {
        setSelectedIds(['free']); // Marca apenas o Livre e limpa o resto
      }
      return;
    }

    // Regra para outros temas (Multiseleção)
    let newSelection = [...selectedIds];
    
    // Se o modo LIVRE estava marcado, ele é removido ao selecionar outro
    if (newSelection.includes('free')) {
      newSelection = [];
    }

    if (newSelection.includes(id)) {
      newSelection = newSelection.filter(themeId => themeId !== id);
    } else {
      newSelection.push(id);
    }
    setSelectedIds(newSelection);
  };

  const handleStartGame = () => {
    const themes = THEMES.filter(t => selectedIds.includes(t.id));
    onStart(themes);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative">
      {/* Barra superior */}
      <div className="p-4 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm pt-8 md:pt-4">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-700"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="ml-4">
            <h2 className="font-bold text-lg text-slate-800 leading-tight">Escolha Temas</h2>
            <p className="text-xs text-slate-500">Selecione um ou mais</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const isSelected = selectedIds.includes(theme.id);
          const isFree = theme.id === 'free';
          
          return (
            <button
              key={theme.id}
              onClick={() => toggleTheme(theme.id)}
              className={`w-full group text-left relative overflow-hidden rounded-3xl p-6 shadow-md transition-all duration-200 transform hover:-translate-y-1 active:scale-98 border-2
                ${isSelected 
                  ? 'bg-white border-yellow-400 ring-2 ring-yellow-200' 
                  : isFree 
                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300' // Estilo diferenciado pro Livre
                    : 'bg-white border-transparent hover:border-slate-200'
                }
              `}
            >
              {/* Checkbox visual */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20
                 ${isSelected ? 'bg-yellow-400 border-yellow-400' : 'border-slate-300 bg-white'}
              `}>
                  {isSelected && <Check size={14} className="text-black" />}
              </div>

              {/* Círculo decorativo colorido */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${theme.color} opacity-20 rounded-bl-full transition-transform ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`} />
              
              <div className="flex items-start gap-4 relative z-10 pr-6">
                <div className={`p-4 rounded-2xl ${theme.color} ${theme.textColor} shadow-sm transition-transform ${isSelected ? 'scale-110' : ''}`}>
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

      {/* Botão de Iniciar Flutuante */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] backdrop-blur-sm bg-white/90">
         <button
            onClick={handleStartGame}
            disabled={selectedIds.length === 0}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
         >
            <span>INICIAR {selectedIds.length > 0 ? (selectedIds.includes('free') ? 'LIVRE' : `(${selectedIds.length})`) : ''}</span>
            <Play size={24} fill="currentColor" />
         </button>
      </div>
    </div>
  );
};
