import { useEffect, useReducer, useCallback, useState } from 'react';
import {
  Play,
  ChevronLeft,
  Cloud,
  Plus,
  Trash2,
  Users,
  Check,
} from 'lucide-react';
import { THEMES, type Theme } from './data';
import GameScreen from './GameScreen';

// Tipos para as telas do app
type Screen = 'home' | 'register' | 'theme-selection' | 'game';

type State = {
  screen: Screen;
  players: string[];
  themes: Theme[];
};

type Action =
  | { type: 'GO_HOME' }
  | { type: 'GO_REGISTER' }
  | { type: 'GO_THEME_SELECTION' }
  | { type: 'GO_GAME' }
  | { type: 'SET_PLAYERS'; players: string[] }
  | { type: 'SET_THEMES'; themes: Theme[] }
  | { type: 'RESET' };

const STORAGE_KEY = 'ito_app_state_v1';

type PersistedState = {
  screen: Screen;
  players: string[];
  themeIds: string[];
};

const initialState: State = {
  screen: 'home',
  players: [],
  themes: [],
};

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function isScreen(x: any): x is Screen {
  return x === 'home' || x === 'register' || x === 'theme-selection' || x === 'game';
}

function initFromStorage(): State {
  const parsed = safeParseJSON<PersistedState>(localStorage.getItem(STORAGE_KEY));
  if (!parsed) return initialState;

  const screen: Screen = isScreen(parsed.screen) ? parsed.screen : 'home';

  const players = Array.isArray(parsed.players)
    ? parsed.players
        .filter((p) => typeof p === 'string' && p.trim().length > 0)
        .map((p) => p.trim())
    : [];

  const themeIds = Array.isArray(parsed.themeIds)
    ? parsed.themeIds
        .filter((id) => typeof id === 'string' && id.trim().length > 0)
        .map((id) => id.trim())
    : [];

  const themes = THEMES.filter((t) => themeIds.includes(t.id));

  return { screen, players, themes };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GO_HOME':
      return { ...state, screen: 'home' };

    case 'GO_REGISTER':
      return { ...state, screen: 'register' };

    case 'GO_THEME_SELECTION':
      return { ...state, screen: 'theme-selection' };

    case 'GO_GAME':
      return { ...state, screen: 'game' };

    case 'SET_PLAYERS':
      return { ...state, players: action.players };

    case 'SET_THEMES':
      return { ...state, themes: action.themes };

    case 'RESET': {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      return initialState;
    }

    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    try {
      return initFromStorage();
    } catch {
      return initialState;
    }
  });

  // ✅ Opção 1: cast local seguro (sem @ts-ignore) para suportar TS que não tipa lock()
  useEffect(() => {
    const tryLock = async () => {
      try {
        const orientation = window.screen?.orientation as ScreenOrientation & {
          lock?: (orientation: string) => Promise<void>;
        };

        if (typeof orientation?.lock === 'function') {
          await orientation.lock('portrait');
        }
      } catch {
        // falha é comum em browser padrão; em Capacitor, prefira travar nativamente
      }
    };

    // tentativa inicial
    tryLock();

    // re-tenta quando ocorrer mudança
    const onOrientationChange = () => tryLock();
    window.addEventListener('orientationchange', onOrientationChange);

    // re-tenta no primeiro toque (aumenta chance em alguns browsers)
    const onFirstTouch = () => {
      tryLock();
      window.removeEventListener('touchstart', onFirstTouch);
    };
    window.addEventListener('touchstart', onFirstTouch, { passive: true });

    return () => {
      window.removeEventListener('orientationchange', onOrientationChange);
      window.removeEventListener('touchstart', onFirstTouch);
    };
  }, []);

  // Persistência (salva IDs dos temas para re-hidratar via THEMES)
  useEffect(() => {
    try {
      const persisted: PersistedState = {
        screen: state.screen,
        players: state.players,
        themeIds: state.themes.map((t) => t.id),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // ignore
    }
  }, [state.screen, state.players, state.themes]);

  // Fluxo de navegação
  const handlePlayersConfirmed = useCallback((registeredPlayers: string[]) => {
    dispatch({ type: 'SET_PLAYERS', players: registeredPlayers });
    dispatch({ type: 'GO_THEME_SELECTION' });
  }, []);

  const handleThemesConfirmed = useCallback((themes: Theme[]) => {
    dispatch({ type: 'SET_THEMES', themes });
    dispatch({ type: 'GO_GAME' });
  }, []);

  const renderScreen = () => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen onPlay={() => dispatch({ type: 'GO_REGISTER' })} />;

      case 'register':
        return (
          <RegisterScreen
            onBack={() => dispatch({ type: 'GO_HOME' })}
            onNext={handlePlayersConfirmed}
          />
        );

      case 'theme-selection':
        return (
          <ThemeSelectionScreen
            onBack={() => dispatch({ type: 'GO_REGISTER' })}
            onStart={handleThemesConfirmed}
          />
        );

      case 'game':
        return (
          <GameScreen
            onBack={() => dispatch({ type: 'GO_HOME' })}
            players={state.players}
            themes={state.themes}
          />
        );

      default:
        return <HomeScreen onPlay={() => dispatch({ type: 'GO_REGISTER' })} />;
    }
  };

  return (
    <div className="w-full h-screen bg-white text-slate-900 font-sans overflow-hidden flex flex-col selection:bg-yellow-200">
      {renderScreen()}
    </div>
  );
}

// --- Componentes Auxiliares (Ficam no App.tsx ou em Components separados) ---

// Tela Inicial
const HomeScreen = ({ onPlay }: { onPlay: () => void }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-400 to-sky-200 relative overflow-hidden">
      <div className="absolute top-12 left-[-40px] opacity-80 animate-pulse">
        <Cloud size={120} className="text-white fill-white drop-shadow-sm" />
      </div>
      <div className="absolute top-24 right-[-20px] opacity-60">
        <Cloud size={100} className="text-white fill-white drop-shadow-sm" />
      </div>
      <div className="absolute bottom-32 left-8 opacity-40">
        <Cloud size={64} className="text-white fill-white" />
      </div>

      <div className="z-10 flex flex-col items-center mb-16 animate-fade-in-down">
        <h1
          className="text-9xl font-black tracking-tighter text-white drop-shadow-lg select-none"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
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

// Tela de Cadastro
const RegisterScreen = ({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (players: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    const v = inputValue.trim();
    if (!v) return;
    setLocalPlayers((prev) => [...prev, v]);
    setInputValue('');
  };

  const removePlayer = (index: number) => {
    setLocalPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top">
        <button
          onClick={onBack}
          className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <span className="ml-4 font-bold text-lg text-slate-700">Quem vai jogar?</span>
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        <div className="bg-white p-4 rounded-3xl shadow-lg mb-6 border border-slate-100 shrink-0">
          <label className="block text-slate-500 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">
            Adicionar Jogador
          </label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Nome do participante"
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
            <button
              onClick={addPlayer}
              disabled={!inputValue.trim()}
              className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl p-3 shadow-md transition-all active:scale-95"
              aria-label="Adicionar jogador"
              title="Adicionar"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {localPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-300">
              <Users size={48} className="mb-2 opacity-50" />
              <p>Adicione pelo menos 2 jogadores</p>
            </div>
          ) : (
            localPlayers.map((player, index) => (
              <div
                key={`${player}-${index}`}
                className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-fade-in"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold shadow-sm shrink-0">
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700 truncate max-w-[150px]">
                    {player}
                  </span>
                </div>
                <button
                  onClick={() => removePlayer(index)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label={`Remover ${player}`}
                  title="Remover"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shrink-0 safe-bottom">
        <button
          onClick={() => onNext(localPlayers)}
          disabled={localPlayers.length < 2}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>PRÓXIMO</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
      </div>
    </div>
  );
};

// Tela de Seleção de Temas
const ThemeSelectionScreen = ({
  onBack,
  onStart,
}: {
  onBack: () => void;
  onStart: (themes: Theme[]) => void;
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleTheme = (id: string) => {
    // regra especial: "free" é exclusivo
    if (id === 'free') {
      setSelectedIds((prev) => (prev.includes('free') ? [] : ['free']));
      return;
    }

    setSelectedIds((prev) => {
      let next = [...prev];

      // se tinha free, remove e segue com seleção normal
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
        <button
          onClick={onBack}
          className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <div className="ml-4">
          <h2 className="font-bold text-lg text-slate-800">Escolha o Tema</h2>
          <p className="text-xs text-slate-500">O que vamos debater hoje?</p>
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
                isSelected
                  ? 'bg-white border-sky-500 ring-4 ring-sky-100 scale-[1.02]'
                  : 'bg-white border-transparent hover:border-slate-200'
              }`}
            >
              <div
                className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors z-20 ${
                  isSelected ? 'bg-sky-500 border-sky-500' : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check size={14} className="text-white" />}
              </div>

              <div
                className={`absolute top-0 right-0 w-32 h-32 ${theme.color} opacity-20 rounded-bl-full transition-transform ${
                  isSelected ? 'scale-150' : 'group-hover:scale-110'
                }`}
              />

              <div className="flex items-start gap-4 relative z-10 pr-6">
                <div className={`p-4 rounded-2xl ${theme.color} ${theme.textColor} shadow-sm`}>
                  <Icon size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-slate-800 mb-1">{theme.name}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-bottom">
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
};