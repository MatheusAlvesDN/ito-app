import { useEffect, useReducer } from 'react';
import { Play, Cloud, ChevronLeft, Zap, Ghost } from 'lucide-react';
import { THEMES, type Theme } from './data';

// --- IMPORTS DOS COMPONENTES ---
import RegisterScreenClassic from './ito/RegisterScreen';
import ThemeSelectionClassic from './ito/ThemeSelection';
import GameScreenIto from './ito/GameScreen';
import RegisterScreenImpostor from './ito/RegisterScreen';
import ThemeSelectionImpostor from './ito/ThemeSelection';
import GameScreenImpostor from './impostor/GameScreen';

// --- TIPOS ---
export type GameMode = 'classic' | 'impostor';

// Define todas as telas possíveis
type Screen = 
  | 'home' 
  | 'mode-selection' 
  | 'register-classic'
  | 'register-impostor'
  | 'theme-classic'
  | 'theme-impostor'
  | 'game-classic'
  | 'game-impostor';

type State = {
  screen: Screen;
  gameMode: GameMode;
  players: string[];
  themes: Theme[];
};

type Action =
  | { type: 'GO_HOME' }
  | { type: 'GO_MODE_SELECTION' }
  | { type: 'SELECT_MODE_CLASSIC' }
  | { type: 'SELECT_MODE_IMPOSTOR' }
  | { type: 'PLAYERS_CONFIRMED'; players: string[] }
  | { type: 'THEMES_CONFIRMED'; themes: Theme[] }
  | { type: 'RESET' };

const STORAGE_KEY = 'ito_app_state_v4'; // Versão 4

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

    case 'SELECT_MODE_CLASSIC':
      return { 
        ...state, 
        gameMode: 'classic', 
        screen: 'register-classic' 
      };

    case 'SELECT_MODE_IMPOSTOR':
      return { 
        ...state, 
        gameMode: 'impostor', 
        screen: 'register-impostor' 
      };

    case 'PLAYERS_CONFIRMED':
      // Decide qual tela de tema mostrar baseado no modo atual
      if (state.gameMode === 'impostor') {
        return { ...state, players: action.players, screen: 'theme-impostor' };
      }
      return { ...state, players: action.players, screen: 'theme-classic' };

    case 'THEMES_CONFIRMED':
      // Decide qual tela de jogo mostrar
      if (state.gameMode === 'impostor') {
        return { ...state, themes: action.themes, screen: 'game-impostor' };
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

  // Lock Orientation
  useEffect(() => {
     // ... (Código de lock orientation igual ao anterior) ...
  }, []);


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
          />
        );

      // --- FLUXO CLÁSSICO ---
      case 'register-classic':
        return (
          <RegisterScreenClassic
            onBack={() => dispatch({ type: 'GO_MODE_SELECTION' })}
            onNext={(players) => dispatch({ type: 'PLAYERS_CONFIRMED', players })}
          />
        );
      case 'theme-classic':
        return (
          <ThemeSelectionClassic
            onBack={() => dispatch({ type: 'SELECT_MODE_CLASSIC' })} // Volta para registro
            onStart={(themes) => dispatch({ type: 'THEMES_CONFIRMED', themes })}
          />
        );
      case 'game-classic':
        return (
          <GameScreenIto
            onBack={() => dispatch({ type: 'GO_HOME' })}
            players={state.players}
            themes={state.themes}
          />
        );

      // --- FLUXO IMPOSTOR ---
      case 'register-impostor':
        return (
          <RegisterScreenImpostor
            onBack={() => dispatch({ type: 'GO_MODE_SELECTION' })}
            onNext={(players) => dispatch({ type: 'PLAYERS_CONFIRMED', players })}
          />
        );
      case 'theme-impostor':
        return (
          <ThemeSelectionImpostor
            onBack={() => dispatch({ type: 'SELECT_MODE_IMPOSTOR' })} // Volta para registro
            onStart={(themes) => dispatch({ type: 'THEMES_CONFIRMED', themes })}
          />
        );
      case 'game-impostor':
        return (
          <GameScreenImpostor
            onBack={() => dispatch({ type: 'GO_HOME' })}
            players={state.players}
            themes={state.themes}
          />
        );

      default:
        return <HomeScreen onPlay={() => dispatch({ type: 'GO_MODE_SELECTION' })} />;
    }
  };

  return (
    <div className="w-full h-screen bg-white text-slate-900 font-sans overflow-hidden flex flex-col selection:bg-yellow-200">
      {renderScreen()}
    </div>
  );
}

// --- COMPONENTES DA UI (Home e ModeSelection) ---

const HomeScreen = ({ onPlay }: { onPlay: () => void }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-400 to-sky-200 relative overflow-hidden">
      <div className="absolute top-12 left-[-40px] opacity-80 animate-pulse">
        <Cloud size={120} className="text-white fill-white drop-shadow-sm" />
      </div>
      <div className="absolute top-24 right-[-20px] opacity-60">
        <Cloud size={100} className="text-white fill-white drop-shadow-sm" />
      </div>

      <div className="z-10 flex flex-col items-center mb-16 animate-fade-in-down">
        <h1 className="text-9xl font-black tracking-tighter text-white drop-shadow-lg select-none" style={{ fontFamily: 'system-ui, sans-serif' }}>
          ITO
        </h1>
        <p className="text-sky-900 mt-2 font-bold tracking-[0.2em] text-sm uppercase bg-white/30 px-4 py-1 rounded-full backdrop-blur-sm">
          Mobile Experience
        </p>
      </div>

      <div className="z-10 w-full max-w-xs animate-bounce" style={{ animationDuration: '2s' }}>
        <button
          onClick={onPlay}
          className="group w-full bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-black text-3xl py-6 rounded-full shadow-[0_10px_0_rgb(161,98,7)] transition-all duration-200 transform hover:-translate-y-1 active:translate-y-2 active:shadow-none flex items-center justify-center gap-3 border-2 border-yellow-500"
        >
          <Play className="w-8 h-8 fill-black" />
          <span>JOGAR</span>
        </button>
      </div>
    </div>
  );
};

const ModeSelectionScreen = ({
  onBack,
  onSelectClassic,
  onSelectImpostor,
}: {
  onBack: () => void;
  onSelectClassic: () => void;
  onSelectImpostor: () => void;
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <span className="ml-4 font-bold text-lg text-slate-700">Modo de Jogo</span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center gap-6">
        {/* ITO Clássico */}
        <button
          onClick={onSelectClassic}
          className="group relative w-full bg-white p-8 rounded-3xl shadow-lg border-2 border-yellow-400 hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={100} className="text-yellow-500 fill-yellow-500" />
           </div>
           <div className="relative z-10 flex flex-col gap-2">
             <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-2">
                <Zap size={32} />
             </div>
             <h3 className="text-3xl font-black text-slate-800">ITO Clássico</h3>
             <p className="text-slate-500 font-medium">Cooperação total. Ordene os números sem falar o valor!</p>
           </div>
        </button>

        {/* Impostor */}
        <button
          onClick={onSelectImpostor}
          className="group relative w-full bg-slate-800 p-8 rounded-3xl shadow-lg border-2 border-slate-700 hover:border-purple-500 hover:bg-slate-750 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Ghost size={100} className="text-purple-400 fill-purple-400" />
           </div>
           <div className="relative z-10 flex flex-col gap-2">
             <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center text-purple-400 mb-2">
                <Ghost size={32} />
             </div>
             <h3 className="text-3xl font-black text-white">IMPOSTOR</h3>
             <p className="text-slate-400 font-medium">Um traidor entre nós. Quem recebeu a pergunta diferente?</p>
             <div className="inline-block bg-purple-900/50 px-2 py-1 rounded text-xs text-purple-200 mt-2 font-bold border border-purple-500/30">
               Mín. 3 Jogadores
             </div>
           </div>
        </button>
      </div>
    </div>
  );
};