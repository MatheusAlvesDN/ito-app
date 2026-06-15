import React, { Suspense, useEffect, useReducer } from 'react';
import { Play, Cloud, ChevronLeft, Zap, Ghost, UserSearch, RefreshCw } from 'lucide-react';
import { THEMES } from './data';
import { syncService } from './utils/syncService';
import { Toaster } from 'sonner';

// --- IMPORTS DOS COMPONENTES ---
import RegisterScreenClassic from './ito/RegisterScreen';
import ThemeSelectionClassic from './ito/ThemeSelection';
import RegisterScreenImpostor from './impostor/RegisterScreen';
import ThemeSelectionImpostor from './impostor/ThemeSelection';
import RegisterScreenWhoAmI from './whoami/RegisterScreen';
import ThemeSelectionWhoAmI from './whoami/ThemeSelection';

// Lazy load para as telas de jogos
const GameScreenIto = React.lazy(() => import('./ito/GameScreen'));
const GameScreenImpostor = React.lazy(() => import('./impostor/GameScreen'));
const GameScreenWhoAmI = React.lazy(() => import('./whoami/GameScreen'));

// --- LOBBY COMPONENTS ---
import { ConnectionSelectionScreen } from './components/lobby/ConnectionSelectionScreen';
import { LobbySetupScreen } from './components/lobby/LobbySetupScreen';
import { MultiplayerLobbyScreen } from './components/lobby/MultiplayerLobbyScreen';

// --- HOOKS ---
import { useMultiplayerSync } from './hooks/useMultiplayerSync';

// --- TIPOS ---
export type GameMode = 'classic' | 'impostor' | 'whoami';

// Define todas as telas possíveis
type Screen = 
  | 'home' 
  | 'mode-selection' 
  | 'connection-selection'
  | 'lobby-setup'
  | 'multiplayer-lobby'
  | 'register-classic'
  | 'register-impostor'
  | 'theme-classic'
  | 'theme-impostor'
  | 'game-classic'
  | 'game-impostor'
  | 'register-whoami'
  | 'theme-whoami'
  | 'game-whoami';

type State = {
  screen: Screen;
  gameMode: GameMode;
  players: string[];
  themes: any[];
};

type Action =
  | { type: 'GO_HOME' }
  | { type: 'GO_MODE_SELECTION' }
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SELECT_MODE_CLASSIC' }
  | { type: 'SELECT_MODE_IMPOSTOR' }
  | { type: 'SELECT_MODE_WHOAMI' }
  | { type: 'PLAYERS_CONFIRMED'; players: string[] }
  | { type: 'THEMES_CONFIRMED'; themes: any[] }
  | { type: 'RESET' };

const STORAGE_KEY = 'ito_app_state_v4';

type PersistedState = {
  screen: Screen;
  gameMode: GameMode;
  players: string[];
  themeIds: string[];
};

const initialState: State = {
  screen: 'home',
  gameMode: 'classic',
  players: [],
  themes: [],
};

// --- REDUCER ---

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GO_HOME':
      return { ...state, screen: 'home' };

    case 'GO_MODE_SELECTION':
      return { ...state, screen: 'mode-selection' };

    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'SELECT_MODE_CLASSIC':
      return { 
        ...state, 
        gameMode: 'classic', 
        screen: 'connection-selection' 
      };

    case 'SELECT_MODE_IMPOSTOR':
      return { 
        ...state, 
        gameMode: 'impostor', 
        screen: 'connection-selection'
      };

    case 'SELECT_MODE_WHOAMI':
      return { 
        ...state, 
        gameMode: 'whoami', 
        screen: 'connection-selection'
      };

    case 'PLAYERS_CONFIRMED':
      if (state.gameMode === 'impostor') {
        return { ...state, players: action.players, screen: 'theme-impostor' };
      }
      if (state.gameMode === 'whoami') {
        return { ...state, players: action.players, screen: 'theme-whoami' };
      }
      return { ...state, players: action.players, screen: 'theme-classic' };

    case 'THEMES_CONFIRMED':
      if (state.gameMode === 'impostor') {
        return { ...state, themes: action.themes, screen: 'game-impostor' };
      }
      if (state.gameMode === 'whoami') {
        return { ...state, themes: action.themes, screen: 'game-whoami' };
      }
      return { ...state, themes: action.themes, screen: 'game-classic' };

    case 'RESET':
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      return initialState;

    default:
      return state;
  }
}

// --- APP ---

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    // Hidratação simples
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: PersistedState = JSON.parse(saved);
        // Recria os objetos Theme a partir dos IDs
        const themes = THEMES.filter(t => parsed.themeIds.includes(t.id));
        return { ...parsed, themes };
      } catch {}
    }
    return initialState;
  });

  const onScreenChange = (screen: any) => dispatch({ type: 'SET_SCREEN', screen });

  const {
    connectionType,
    setConnectionType,
    roomCode,
    isHost,
    connectedPlayers,
    syncGameState,
    playerName,
    setPlayerName,
    playerId,
    isConnecting,
    handleConnect,
    handleDisconnect,
  } = useMultiplayerSync(onScreenChange);

  // Persistência
  useEffect(() => {
    const toSave: PersistedState = {
      screen: state.screen,
      gameMode: state.gameMode,
      players: state.players,
      themeIds: state.themes.map(t => t.id)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  const renderScreen = () => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen onPlay={() => dispatch({ type: 'GO_MODE_SELECTION' })} />;
      
      case 'mode-selection':
        return (
          <ModeSelectionScreen
            onBack={() => dispatch({ type: 'GO_HOME' })}
            onSelectClassic={() => dispatch({ type: 'SELECT_MODE_CLASSIC' })}
            onSelectImpostor={() => dispatch({ type: 'SELECT_MODE_IMPOSTOR' })}
            onSelectWhoAmI={() => dispatch({ type: 'SELECT_MODE_WHOAMI' })}
          />
        );

      case 'connection-selection':
        return (
          <ConnectionSelectionScreen
            onBack={() => dispatch({ type: 'GO_MODE_SELECTION' })}
            onSelectLocal={() => {
              setConnectionType('local');
              if (state.gameMode === 'impostor') {
                dispatch({ type: 'SET_SCREEN', screen: 'register-impostor' });
              } else if (state.gameMode === 'whoami') {
                dispatch({ type: 'SET_SCREEN', screen: 'register-whoami' });
              } else {
                dispatch({ type: 'SET_SCREEN', screen: 'register-classic' });
              }
            }}
            onSelectMultiplayer={() => {
              setConnectionType('multiplayer');
              dispatch({ type: 'SET_SCREEN', screen: 'lobby-setup' });
            }}
            gameMode={state.gameMode}
          />
        );

      case 'lobby-setup':
        return (
          <LobbySetupScreen
            onBack={() => dispatch({ type: 'SET_SCREEN', screen: 'connection-selection' })}
            playerName={playerName}
            setPlayerName={setPlayerName}
            isConnecting={isConnecting}
            handleConnect={(ip, action, code) => handleConnect(ip, action, code, () => dispatch({ type: 'SET_SCREEN', screen: 'multiplayer-lobby' }))}
            gameMode={state.gameMode}
          />
        );

      case 'multiplayer-lobby':
        return (
          <MultiplayerLobbyScreen
            onBack={() => {
              handleDisconnect();
              dispatch({ type: 'SET_SCREEN', screen: 'lobby-setup' });
            }}
            roomCode={roomCode}
            isHost={isHost}
            connectedPlayers={connectedPlayers}
            onStartGame={() => {
              if (state.gameMode === 'impostor') {
                dispatch({ type: 'SET_SCREEN', screen: 'theme-impostor' });
              } else if (state.gameMode === 'classic') {
                dispatch({ type: 'SET_SCREEN', screen: 'theme-classic' });
              } else {
                dispatch({ type: 'SET_SCREEN', screen: 'theme-whoami' });
              }
            }}
            gameMode={state.gameMode}
          />
        );

      // --- FLUXO CLÁSSICO ---
      case 'register-classic':
        return (
          <RegisterScreenClassic
            onBack={() => dispatch({ type: 'SET_SCREEN', screen: 'connection-selection' })}
            onNext={(players) => dispatch({ type: 'PLAYERS_CONFIRMED', players })}
          />
        );
      case 'theme-classic':
        if (connectionType === 'multiplayer' && !isHost) {
          return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-955 text-center text-slate-100 font-sans relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full" />
                <div className="bg-slate-900 border border-white/5 p-6 rounded-full shadow-2xl relative z-10 animate-spin" style={{ animationDuration: '3s' }}>
                  <RefreshCw size={48} className="text-yellow-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-2 font-outfit">Sincronizando Temas...</h2>
              <p className="text-slate-400 max-w-xs text-sm font-medium leading-relaxed animate-pulse">
                O líder da sala está escolhendo os temas do jogo. Prepare-se!
              </p>
            </div>
          );
        }
        return (
          <ThemeSelectionClassic
            onBack={() => {
              if (connectionType === 'multiplayer') {
                handleDisconnect();
                dispatch({ type: 'GO_MODE_SELECTION' });
              } else {
                dispatch({ type: 'SELECT_MODE_CLASSIC' });
              }
            }}
            onStart={(themes) => {
              if (connectionType === 'multiplayer') {
                syncService.syncState({
                  screen: 'game-classic',
                  themes: themes.map(t => ({ id: t.id, name: t.name })),
                  phase: 'init',
                  roundKey: Date.now()
                });
                dispatch({ type: 'THEMES_CONFIRMED', themes });
              } else {
                dispatch({ type: 'THEMES_CONFIRMED', themes });
              }
            }}
          />
        );
      case 'game-classic':
        return (
          <Suspense fallback={<LoadingFallback mode="classic" />}>
            <GameScreenIto
              onBack={() => {
                if (connectionType === 'multiplayer') {
                  handleDisconnect();
                }
                dispatch({ type: 'GO_HOME' });
              }}
              players={connectionType === 'multiplayer' ? connectedPlayers.map(p => p.name) : state.players}
              themes={connectionType === 'multiplayer' ? (syncGameState?.themes || []) : state.themes}
              isMultiplayer={connectionType === 'multiplayer'}
              isHost={isHost}
              syncGameState={syncGameState}
              playerId={playerId}
              connectedPlayers={connectedPlayers}
            />
          </Suspense>
        );

      // --- FLUXO IMPOSTOR ---
      case 'register-impostor':
        return (
          <RegisterScreenImpostor
            onBack={() => dispatch({ type: 'SET_SCREEN', screen: 'connection-selection' })}
            onNext={(players) => dispatch({ type: 'PLAYERS_CONFIRMED', players })}
          />
        );
      case 'theme-impostor':
        if (connectionType === 'multiplayer' && !isHost) {
          return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-center text-slate-100 font-sans relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full" />
                <div className="bg-slate-900 border border-white/5 p-6 rounded-full shadow-2xl relative z-10 animate-spin" style={{ animationDuration: '3s' }}>
                  <RefreshCw size={48} className="text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-2 font-outfit">Sincronizando Temas...</h2>
              <p className="text-slate-400 max-w-xs text-sm font-medium leading-relaxed animate-pulse">
                O líder da sala está escolhendo os temas do jogo. Prepare-se!
              </p>
            </div>
          );
        }
        return (
          <ThemeSelectionImpostor
            onBack={() => {
              if (connectionType === 'multiplayer') {
                handleDisconnect();
                dispatch({ type: 'GO_MODE_SELECTION' });
              } else {
                dispatch({ type: 'SET_SCREEN', screen: 'register-impostor' });
              }
            }}
            onStart={(themes) => {
              if (connectionType === 'multiplayer') {
                syncService.syncState({
                  screen: 'game-impostor',
                  themes: themes.map(t => ({ id: t.id, name: t.name })),
                  phase: 'setup',
                  roundKey: Date.now()
                });
                dispatch({ type: 'THEMES_CONFIRMED', themes });
              } else {
                dispatch({ type: 'THEMES_CONFIRMED', themes });
              }
            }}
          />
        );
      case 'game-impostor':
        return (
          <Suspense fallback={<LoadingFallback mode="impostor" />}>
            <GameScreenImpostor
              onBack={() => {
                handleDisconnect();
                dispatch({ type: 'GO_HOME' });
              }}
              players={connectionType === 'multiplayer' ? connectedPlayers.map(p => p.name) : state.players}
              themes={connectionType === 'multiplayer' ? (syncGameState?.themes || []) : state.themes}
              isMultiplayer={connectionType === 'multiplayer'}
              isHost={isHost}
              syncGameState={syncGameState}
              playerId={playerId}
              connectedPlayers={connectedPlayers}
            />
          </Suspense>
        );

      // --- FLUXO QUEM SOU EU ---
      case 'register-whoami':
        return (
          <RegisterScreenWhoAmI
            onBack={() => dispatch({ type: 'SET_SCREEN', screen: 'connection-selection' })}
            onNext={(players) => dispatch({ type: 'PLAYERS_CONFIRMED', players })}
          />
        );
      case 'theme-whoami':
        if (connectionType === 'multiplayer' && !isHost) {
          return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-955 text-center text-slate-100 font-sans relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                <div className="bg-slate-900 border border-white/5 p-6 rounded-full shadow-2xl relative z-10 animate-spin" style={{ animationDuration: '3s' }}>
                  <RefreshCw size={48} className="text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-white mb-2 font-outfit">Sincronizando Temas...</h2>
              <p className="text-slate-400 max-w-xs text-sm font-medium leading-relaxed animate-pulse">
                O líder da sala está escolhendo os temas do jogo. Prepare-se!
              </p>
            </div>
          );
        }
        return (
          <ThemeSelectionWhoAmI
            onBack={() => {
              if (connectionType === 'multiplayer') {
                handleDisconnect();
                dispatch({ type: 'GO_MODE_SELECTION' });
              } else {
                dispatch({ type: 'SET_SCREEN', screen: 'register-whoami' });
              }
            }}
            onStart={(themes) => {
              if (connectionType === 'multiplayer') {
                syncService.syncState({
                  screen: 'game-whoami',
                  themes: themes.map(t => ({ id: t.id, name: t.name })),
                  phase: 'setup',
                  roundKey: Date.now()
                });
                dispatch({ type: 'THEMES_CONFIRMED', themes });
              } else {
                dispatch({ type: 'THEMES_CONFIRMED', themes });
              }
            }}
          />
        );
      case 'game-whoami':
        return (
          <Suspense fallback={<LoadingFallback mode="whoami" />}>
            <GameScreenWhoAmI
              onBack={() => {
                handleDisconnect();
                dispatch({ type: 'GO_HOME' });
              }}
              players={connectionType === 'multiplayer' ? connectedPlayers.map(p => p.name) : state.players}
              themes={connectionType === 'multiplayer' ? (syncGameState?.themes || []) : state.themes}
              isMultiplayer={connectionType === 'multiplayer'}
              isHost={isHost}
              syncGameState={syncGameState}
              playerId={playerId}
              connectedPlayers={connectedPlayers}
            />
          </Suspense>
        );

      default:
        return <HomeScreen onPlay={() => dispatch({ type: 'GO_MODE_SELECTION' })} />;
    }
  };

  return (
    <div className="w-full h-full min-h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden flex flex-col selection:bg-yellow-200 relative">
      <Toaster position="top-center" theme="dark" richColors />
      {/* Container principal livre de barras de rolagem globais */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        {renderScreen()}
      </div>
    </div>
  );
}

// --- AUXILIARY COMPONENTS ---

const LoadingFallback = ({ mode }: { mode: GameMode }) => {
  const getColors = () => {
    if (mode === 'impostor') return 'text-purple-400 bg-purple-500/10';
    if (mode === 'classic') return 'text-yellow-400 bg-yellow-500/10';
    return 'text-emerald-400 bg-emerald-500/10';
  };
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-950 h-full w-full">
      <div className={`p-6 rounded-full animate-spin ${getColors()}`}>
        <RefreshCw size={48} />
      </div>
    </div>
  );
}

// --- COMPONENTES DA UI (Home e ModeSelection) ---

const HomeScreen = ({ onPlay }: { onPlay: () => void }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 relative overflow-hidden h-full">
      {/* Background blobs com glow de vidro (Glassmorphism) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] animate-float-medium pointer-events-none" />

      <div className="absolute top-12 left-6 opacity-30 animate-float-slow pointer-events-none">
        <Cloud size={80} className="text-sky-300 fill-sky-300/10 drop-shadow-sm" />
      </div>
      <div className="absolute top-32 right-8 opacity-20 animate-float-medium pointer-events-none">
        <Cloud size={100} className="text-purple-300 fill-purple-300/10 drop-shadow-sm" />
      </div>

      <div className="z-10 flex flex-col items-center mb-16 animate-fade-in-scale">
        <div className="mb-4 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
          <p className="text-indigo-200 font-bold tracking-[0.2em] text-xs uppercase font-outfit">
            Party Games Experience
          </p>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-2xl select-none text-center leading-none font-outfit">
          PARTY<br/><span className="text-yellow-400">GAMES</span>
        </h1>
        <p className="text-slate-400 mt-4 text-center max-w-xs font-medium text-sm">
          A melhor experiência de jogos de tabuleiro em grupo na tela do seu celular!
        </p>
      </div>

      <div className="z-10 w-full max-w-xs animate-fade-in">
        <button
          onClick={onPlay}
          className="group w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 active:from-yellow-500 active:to-amber-600 text-black font-black text-2xl py-5 rounded-3xl shadow-[0_8px_0_rgb(180,83,9)] hover:shadow-[0_6px_0_rgb(180,83,9)] active:shadow-none transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-2 flex items-center justify-center gap-3 border border-yellow-300/50 font-outfit"
        >
          <Play className="w-6 h-6 fill-black" />
          <span>JOGAR AGORA</span>
        </button>
      </div>
    </div>
  );
};

const ModeSelectionScreen = ({
  onBack,
  onSelectClassic,
  onSelectImpostor,
  onSelectWhoAmI,
}: {
  onBack: () => void;
  onSelectClassic: () => void;
  onSelectImpostor: () => void;
  onSelectWhoAmI: () => void;
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Escolha o Modo</span>
      </div>

      {/* Área Rolável sem duplicidade de scroll */}
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto pb-12">
        {/* ITO Clássico */}
        <button
          onClick={onSelectClassic}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-yellow-500/20 hover:border-yellow-400/80 hover:bg-yellow-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
        >
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={120} className="text-yellow-400 fill-yellow-400" />
           </div>
           <div className="relative z-10 flex flex-col gap-2">
             <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-yellow-400 mb-2">
                <Zap size={24} />
             </div>
             <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-white font-outfit">ITO Clássico</h3>
               <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">Coop</span>
             </div>
             <p className="text-slate-400 font-medium text-sm leading-relaxed">Cooperação total. Ordene os números da sua equipe de forma crescente sem falar o valor direto!</p>
           </div>
        </button>

        {/* Impostor */}
        <button
          onClick={onSelectImpostor}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-purple-500/20 hover:border-purple-400/80 hover:bg-purple-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Ghost size={120} className="text-purple-400 fill-purple-400" />
           </div>
           <div className="relative z-10 flex flex-col gap-2">
             <div className="w-12 h-12 bg-purple-400/10 border border-purple-400/20 rounded-2xl flex items-center justify-center text-purple-400 mb-2">
                <Ghost size={24} />
             </div>
             <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-white font-outfit">IMPOSTOR</h3>
               <span className="bg-purple-400/10 border border-purple-400/30 text-purple-300 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">Bluff</span>
             </div>
             <p className="text-slate-400 font-medium text-sm leading-relaxed">Um traidor entre nós. Todos recebem a mesma pergunta, exceto o Impostor. Quem será que está blefando?</p>
             <div className="inline-block w-fit bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-xl text-[11px] text-purple-200 mt-2 font-bold font-outfit">
               Mínimo 3 Jogadores
             </div>
           </div>
        </button>

        {/* Quem Sou Eu */}
        <button
          onClick={onSelectWhoAmI}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-emerald-500/20 hover:border-emerald-400/80 hover:bg-emerald-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserSearch size={120} className="text-emerald-400 fill-emerald-400" />
           </div>
           <div className="relative z-10 flex flex-col gap-2">
             <div className="w-12 h-12 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-2">
                <UserSearch size={24} />
             </div>
             <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-white font-outfit">QUEM SOU EU?</h3>
               <span className="bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">Casual</span>
             </div>
             <p className="text-slate-400 font-medium text-sm leading-relaxed">Coloque o celular na testa! Você é o único jogador do grupo que não sabe quem é seu próprio personagem.</p>
             <div className="inline-block w-fit bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-xl text-[11px] text-emerald-200 mt-2 font-bold font-outfit">
               Mínimo 2 Jogadores
             </div>
           </div>
        </button>
      </div>
    </div>
  );
};