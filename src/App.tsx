import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, Settings, Info, Cloud, Plus, Trash2, Users, Star, RefreshCw, ArrowRight, Dices, Eye, Check, Lock, ArrowUp, ArrowDown, Trophy, XCircle, AlertCircle, Layers, Unlock, Zap } from 'lucide-react';

// Tipos para as telas do app
type Screen = 'home' | 'register' | 'theme-selection' | 'game';

// Definição do tipo Tema
type Theme = {
  id: string;
  name: string;
  description: string;
  color: string;
  textColor: string;
  buttonColor: string; // Cor para botões dentro do tema
  icon: React.ElementType;
};

// Banco de Perguntas Simulado (DB)
const QUESTIONS_DB: Record<string, string[]> = {
  classic: [
    "O quão útil seria este objeto em um apocalipse zumbi?",
    "O quão perigoso é este animal?",
    "Nível de popularidade desta celebridade.",
    "O quão difícil é esta profissão?",
    "O quão assustador é este filme?",
    "Nível de inteligência deste personagem fictício.",
    "Filmes do George Melies"
  ],
  anime: [
    "Melhores Cavaleiros de Ouro",
    "Cavaleiros de Bronze mais fortes ",
    "Armaduras mais bonitas de Saint Seiya",
    "Personagens mais injustiçados da obra",
    "Vilões mais memoráveis de Saint Seiya",
    "Melhores lutas dos animes",
    "Sagas de Saint Seiya",
    "Cavaleiros mais leais à Athena",
    "Personagens com o melhor desenvolvimento",
    "Momentos mais emocionantes dos animes",
    "Transformações mais impactantes de Dragon Ball",
    "Vilões mais ameaçadores",
    "Personagens mais fortes ",
    "Sagas de Dragon Ball",
    "Personagens mais desperdiçados pela história",
    "Lutas mais épicas de Dragon Ball Z e Super",
    "Personagens mais carismáticos",
    "Melhores treinamentos",
    "Treinamentos mais dificeis",
    "Mortes mais marcantes (e mais traumáticas)",
    "Melhores protagonistas dos animes",
    "Piores vilões já criados",
    "Personagens mais overpower dos animes",
    "Animes com as melhores trilhas sonoras",
    "Personagens mais inteligentes dos animes",
    "Animes que envelheceram bem",
    "Animes que envelheceram mal",
    "Personagens secundários que roubam a cena",
    "Animes com as melhores lutas",
    "Animes superestimados"
  ]
};

// Lista de Temas Disponíveis
const THEMES: Theme[] = [
  { id: 'free', name: 'Livre', description: 'Sem perguntas definidas. Criem as suas!', color: 'bg-slate-200', textColor: 'text-slate-900', buttonColor: 'bg-slate-400 hover:bg-slate-300', icon: Unlock },
  { id: 'classic', name: 'Clássico', description: 'Perguntas variadas para todos os gostos.', color: 'bg-yellow-100', textColor: 'text-yellow-900', buttonColor: 'bg-yellow-400 hover:bg-yellow-300', icon: Star },
  { id: 'anime', name: 'Anime', description: 'Debates sobre Saint Seiya, Dragon Ball e mais!', color: 'bg-orange-100', textColor: 'text-orange-900', buttonColor: 'bg-orange-400 hover:bg-orange-300', icon: Zap },
];

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
        return <GameScreen onBack={() => setCurrentScreen('home')} players={players} themes={selectedThemes} />;
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

// 4. Tela de Jogo Completa (Com lógica de Múltiplos Temas e Modo Livre)
const GameScreen = ({ onBack, players, themes }: { onBack: () => void, players: string[], themes: Theme[] }) => {
  const [phase, setPhase] = useState<'init' | 'rolling' | 'numbers' | 'ordering' | 'result'>('init');
  const [playerNumbers, setPlayerNumbers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentThemeColor, setCurrentThemeColor] = useState<string>('');
  const [round, setRound] = useState(1);
  const [orderedPlayers, setOrderedPlayers] = useState<string[]>([]);
  const [isVictory, setIsVictory] = useState(false);
  
  // Estado para controle de segredo
  const [viewingPlayer, setViewingPlayer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [playersSeen, setPlayersSeen] = useState<string[]>([]);

  // Efeito de rolagem de números
  useEffect(() => {
    if (phase === 'rolling') {
      const timeout = setTimeout(() => {
        // Sorteio Silencioso (Números únicos)
        const finalNumbers: Record<string, number> = {};
        const usedNumbers = new Set<number>();
        
        players.forEach(p => {
            let num;
            do {
                num = Math.floor(Math.random() * 100) + 1;
            } while (usedNumbers.has(num));
            usedNumbers.add(num);
            finalNumbers[p] = num;
        });
        
        setPlayerNumbers(finalNumbers);
        setPhase('numbers');
      }, 2000); 

      return () => clearTimeout(timeout);
    }
  }, [phase, players]);

  // Função para começar a rodada
  const startRound = () => {
    setPhase('rolling');
    setPlayersSeen([]);
    setViewingPlayer(null);
    setIsRevealed(false);
    setOrderedPlayers([...players]); 
  };

  // Funções de visualização secreta
  const openSecretView = (player: string) => { setViewingPlayer(player); setIsRevealed(false); };
  const revealNumber = () => setIsRevealed(true);
  const closeSecretView = () => {
    if (viewingPlayer) {
      setPlayersSeen([...playersSeen, viewingPlayer]);
      setViewingPlayer(null);
      setIsRevealed(false);
    }
  };

  // Transição para Ordenação (Modificada para Suportar MODO LIVRE)
  const startOrdering = () => {
    // Verifica se está no modo livre (ID 'free')
    const isFreeMode = themes.some(t => t.id === 'free');

    if (isFreeMode) {
      setCurrentQuestion("MODO LIVRE: Inventem um desafio!");
      setCurrentThemeColor('bg-slate-200'); // Cor neutra para o modo livre
      setPhase('ordering');
      return;
    }

    if (themes.length > 0) {
      // Agrupa todas as perguntas dos temas selecionados
      const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
      
      if (allQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * allQuestions.length);
          const question = allQuestions[randomIndex];
          setCurrentQuestion(question);
          
          const sourceTheme = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(question)) || themes[0];
          setCurrentThemeColor(sourceTheme.color);

          setPhase('ordering');
      }
    }
  };

  const movePlayer = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedPlayers];
    if (direction === 'up' && index > 0) {
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setOrderedPlayers(newOrder);
  };

  const checkResult = () => {
    let correct = true;
    for (let i = 0; i < orderedPlayers.length - 1; i++) {
        const p1 = orderedPlayers[i];
        const p2 = orderedPlayers[i + 1];
        if (playerNumbers[p1] > playerNumbers[p2]) {
            correct = false;
            break;
        }
    }
    setIsVictory(correct);
    setPhase('result');
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setPhase('init');
    setPlayerNumbers({});
    setCurrentQuestion('');
    setPlayersSeen([]);
  };

  if (themes.length === 0) return null;

  // Cor principal para a UI
  const mainThemeColor = themes.length === 1 ? themes[0].buttonColor : 'bg-yellow-400 hover:bg-yellow-300';
  //const textColorClass = themes.length === 1 ? themes[0].textColor : 'text-slate-200';

  // --- RENDERIZAÇÃO DO MODO SECRETO ---
  if (viewingPlayer) {
    return (
      <div className="w-full h-full absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 animate-fade-in">
         <div className="absolute inset-0 bg-black opacity-90"></div>
         <div className="relative z-10 w-full max-w-sm bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col items-center text-center space-y-8">
            {!isRevealed ? (
              <>
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center animate-pulse">
                  <Lock className="text-slate-400" size={40} />
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Segurança</h3>
                  <h2 className="text-2xl font-bold text-white">Passe o celular para <br/><span className="text-yellow-400 text-3xl">{viewingPlayer}</span></h2>
                </div>
                <button onClick={revealNumber} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl py-4 rounded-xl shadow-lg transition-transform active:scale-95">REVELAR NÚMERO</button>
              </>
            ) : (
              <>
                 <div className="flex flex-col items-center animate-bounce-subtle">
                    <span className="text-slate-400 font-medium mb-4">Seu número secreto é:</span>
                    <span className="text-8xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">{playerNumbers[viewingPlayer]}</span>
                 </div>
                 <div className="w-full pt-8 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-4">Memorizou? Não conte pra ninguém!</p>
                    <button onClick={closeSecretView} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg py-3 rounded-xl transition-colors">OK, ESCONDER</button>
                 </div>
              </>
            )}
         </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PADRÃO DO JOGO ---
  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white relative">
      {/* Barra superior */}
      <div className={`p-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 bg-slate-900/90 border-b border-white/5 pt-8 md:pt-4`}>
        <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">RODADA {round}</span>
            <div className={`flex items-center gap-1 text-sm font-bold ${themes.length === 1 ? themes[0].textColor : 'text-yellow-400'}`}>
                {themes.length === 1 ? themes[0].name : (
                    <span className="flex items-center gap-1">Mix de Temas <Layers size={14}/></span>
                )}
            </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        
        {/* FASE 1: INÍCIO */}
        {phase === 'init' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
              <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-4">
                  <Dices size={48} className="text-yellow-400" />
              </div>
              <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-white">Hora do Sorteio!</h2>
                  <p className="text-slate-400 max-w-xs mx-auto">Cada jogador receberá um número aleatório secreto.</p>
              </div>
           </div>
        )}

        {/* FASE 2: EMBARALHANDO */}
        {phase === 'rolling' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-fade-in">
              <div className="flex gap-2">
                 <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-slate-400 font-bold tracking-widest uppercase">Gerando segredos...</p>
           </div>
        )}

        {/* FASE 3: VER NÚMEROS */}
        {phase === 'numbers' && (
          <>
            <p className="text-center text-slate-400 mb-4 animate-fade-in">
              Toque no seu nome para ver seu número. <strong className="text-white block">Mantenha em segredo!</strong>
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {players.map((player) => {
                    const hasSeen = playersSeen.includes(player);
                    return (
                      <button 
                        key={player} 
                        onClick={() => !hasSeen && openSecretView(player)}
                        disabled={hasSeen}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center relative overflow-hidden h-32
                          ${hasSeen ? 'bg-slate-800/50 border-slate-700/50 cursor-default opacity-60' : 'bg-slate-800 border-slate-600 hover:border-yellow-400 hover:bg-slate-700 cursor-pointer shadow-lg active:scale-95'}`}
                      >
                          <span className="text-slate-300 font-bold mb-2 truncate w-full text-center">{player}</span>
                          {hasSeen ? <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center"><Check size={24} /></div> 
                                   : <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center"><Eye size={24} /></div>}
                          <span className="absolute bottom-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">{hasSeen ? 'Pronto' : 'Ver Agora'}</span>
                      </button>
                    );
                })}
            </div>
          </>
        )}

        {/* FASE 4: ORDENAÇÃO (MODIFICADO PARA SUPORTAR MODO LIVRE) */}
        {phase === 'ordering' && (
            <div className="flex flex-col h-full animate-fade-in pb-20">
                {/* Card da Pergunta */}
                <div className={`${currentThemeColor || 'bg-slate-800'} rounded-2xl p-6 mb-6 shadow-lg border-2 border-white/10 relative overflow-hidden`}>
                    <div className="flex items-center gap-2 mb-2 opacity-70 relative z-10">
                        {/* Se for modo livre, usa ícone de desbloqueio, senão estrela */}
                        {themes.some(t => t.id === 'free') ? <Unlock className="text-slate-900" size={20} /> : <Star className="text-slate-900" size={20} />}
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Tema da Vez</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight relative z-10">{currentQuestion}</h3>
                    
                    {/* Elemento decorativo de fundo */}
                    <div className="absolute top-[-20%] right-[-10%] opacity-10">
                       <Cloud size={100} className="fill-current text-white" />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Menor (1)</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Maior (100)</span>
                </div>

                {/* Lista Ordenável */}
                <div className="flex-1 space-y-3">
                    {orderedPlayers.map((player, index) => (
                        <div key={player} className="flex items-center bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-sm animate-fade-in">
                            <div className="flex flex-col gap-1 mr-3">
                                <button onClick={() => movePlayer(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-white disabled:opacity-20"><ArrowUp size={20} /></button>
                                <button onClick={() => movePlayer(index, 'down')} disabled={index === orderedPlayers.length - 1} className="p-1 text-slate-400 hover:text-white disabled:opacity-20"><ArrowDown size={20} /></button>
                            </div>
                            <div className="flex-1">
                                <span className="font-bold text-lg text-white">{player}</span>
                            </div>
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                                ?
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-xs text-slate-500 mt-4">Discutam e ordenem a lista!</p>
            </div>
        )}

        {/* FASE 5: RESULTADO */}
        {phase === 'result' && (
            <div className="flex flex-col h-full animate-fade-in pb-20">
                <div className={`p-6 rounded-3xl mb-6 text-center border-4 ${isVictory ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
                    {isVictory ? (
                        <>
                            <Trophy className="mx-auto text-green-400 mb-2" size={48} />
                            <h2 className="text-3xl font-black text-green-400">SUCESSO!</h2>
                            <p className="text-green-200 text-sm mt-1">A ordem está perfeita!</p>
                        </>
                    ) : (
                        <>
                            <XCircle className="mx-auto text-red-400 mb-2" size={48} />
                            <h2 className="text-3xl font-black text-red-400">FALHA!</h2>
                            <p className="text-red-200 text-sm mt-1">A ordem estava incorreta.</p>
                        </>
                    )}
                </div>

                <div className="space-y-3">
                    {orderedPlayers.map((player, index) => {
                        const num = playerNumbers[player];
                        const prevNum = index > 0 ? playerNumbers[orderedPlayers[index-1]] : -1;
                        const isWrong = index > 0 && num < prevNum; 

                        return (
                            <div key={player} className={`flex items-center p-3 rounded-xl border ${isWrong ? 'bg-red-900/30 border-red-500/50' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="w-8 text-center font-bold text-slate-500 text-sm mr-2">#{index + 1}</div>
                                <div className="flex-1 font-bold text-white">{player}</div>
                                <div className={`px-3 py-1 rounded-lg font-black text-lg ${isWrong ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black'}`}>
                                    {num}
                                </div>
                                {isWrong && <AlertCircle className="ml-2 text-red-400" size={20} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="p-6 bg-slate-900 border-t border-slate-800 z-40">
        {phase === 'init' && (
            <button onClick={startRound} className={`w-full ${mainThemeColor} text-black font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}>
                <Dices size={24} /> <span>SORTEAR NÚMEROS</span>
            </button>
        )}

        {phase === 'numbers' && (
            <button onClick={startOrdering} disabled={playersSeen.length < players.length} className={`w-full font-bold text-xl py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${playersSeen.length < players.length ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : `${mainThemeColor} text-black active:scale-95 animate-pulse`}`}>
                {playersSeen.length < players.length ? <span>AGUARDANDO ({playersSeen.length}/{players.length})</span> : <><span>IR PARA ORDENAÇÃO</span><ArrowRight size={24} /></>}
            </button>
        )}

        {phase === 'ordering' && (
             <button onClick={checkResult} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <Check size={24} /> <span>CONFIRMAR ORDEM</span>
            </button>
        )}

        {phase === 'result' && (
             <button onClick={nextRound} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <RefreshCw size={24} /> <span>PRÓXIMA RODADA</span>
            </button>
        )}
      </div>
    </div>
  );
};