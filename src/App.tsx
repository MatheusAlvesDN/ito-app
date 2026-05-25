import { useEffect, useReducer, useState } from 'react';
import { Play, Cloud, ChevronLeft, Zap, Ghost, UserSearch, Wifi, Server, Users, RefreshCw, Smartphone, Copy, Plus, LogIn, Crown, ArrowRight } from 'lucide-react';
import { THEMES } from './data';
import { syncService } from './utils/syncService';

// --- IMPORTS DOS COMPONENTES ---
import RegisterScreenClassic from './ito/RegisterScreen';
import ThemeSelectionClassic from './ito/ThemeSelection';
import GameScreenIto from './ito/GameScreen';
import RegisterScreenImpostor from './impostor/RegisterScreen';
import ThemeSelectionImpostor from './impostor/ThemeSelection';
import GameScreenImpostor from './impostor/GameScreen';
import RegisterScreenWhoAmI from './whoami/RegisterScreen';
import ThemeSelectionWhoAmI from './whoami/ThemeSelection';
import GameScreenWhoAmI from './whoami/GameScreen';

// --- TIPOS ---
export type GameMode = 'classic' | 'impostor' | 'whoami';

// Define todas as telas possíveis
type Screen = 
  | 'home' 
  | 'mode-selection' 
  | 'connection-selection' // Nova tela
  | 'lobby-setup'          // Nova tela
  | 'multiplayer-lobby'    // Nova tela
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
  | { type: 'SET_SCREEN'; screen: Screen } // Nova ação
  | { type: 'SELECT_MODE_CLASSIC' }
  | { type: 'SELECT_MODE_IMPOSTOR' }
  | { type: 'SELECT_MODE_WHOAMI' }
  | { type: 'PLAYERS_CONFIRMED'; players: string[] }
  | { type: 'THEMES_CONFIRMED'; themes: any[] }
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

    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

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
        screen: 'connection-selection' // Nova rota intermediária
      };

    case 'SELECT_MODE_WHOAMI':
      return { 
        ...state, 
        gameMode: 'whoami', 
        screen: 'connection-selection' // Nova rota intermediária
      };

    case 'PLAYERS_CONFIRMED':
      // Decide qual tela de tema mostrar baseado no modo atual
      if (state.gameMode === 'impostor') {
        return { ...state, players: action.players, screen: 'theme-impostor' };
      }
      if (state.gameMode === 'whoami') {
        return { ...state, players: action.players, screen: 'theme-whoami' };
      }
      return { ...state, players: action.players, screen: 'theme-classic' };

    case 'THEMES_CONFIRMED':
      // Decide qual tela de jogo mostrar
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

// --- HELPER SCREENS FOR MULTIPLAYER ---

const ConnectionSelectionScreen = ({
  onBack,
  onSelectLocal,
  onSelectMultiplayer,
  gameMode,
}: {
  onBack: () => void;
  onSelectLocal: () => void;
  onSelectMultiplayer: () => void;
  gameMode: GameMode;
}) => {
  const getThemeColor = () => {
    if (gameMode === 'impostor') return 'text-purple-400 border-purple-500/20 hover:border-purple-400/85 hover:bg-purple-500/[0.02]';
    return 'text-emerald-400 border-emerald-500/20 hover:border-emerald-400/85 hover:bg-emerald-500/[0.02]';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-800/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Escolha a Conexão</span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center gap-6 max-w-md mx-auto w-full">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-black text-white font-outfit tracking-tight">Como querem jogar?</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Escolha jogar passando o aparelho ou com múltiplos dispositivos.</p>
        </div>

        {/* Local: Passa e Joga */}
        <button
          onClick={onSelectLocal}
          className="group relative w-full bg-slate-900/40 p-6 rounded-3xl border-2 border-slate-850 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-4 bg-slate-850 border border-slate-750 rounded-2xl text-slate-350 shrink-0">
              <Smartphone size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-outfit flex items-center gap-2">
                1 Celular <span className="bg-slate-800 text-slate-350 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Pass & Play</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-medium">Todos jogam na mesma tela, passando o celular a cada rodada. Ideal para qualquer momento.</p>
            </div>
          </div>
        </button>

        {/* Multiplayer: Vários Celulares */}
        <button
          onClick={onSelectMultiplayer}
          className={`group relative w-full bg-slate-900/40 p-6 rounded-3xl border-2 ${getThemeColor()} transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden shadow-lg`}
        >
          <div className="flex items-start gap-4">
            <div className="p-4 bg-slate-850 border border-slate-750 rounded-2xl text-slate-350 shrink-0">
              <Wifi size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-outfit flex items-center gap-2">
                Vários Celulares <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-550/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Sem Fio</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-medium">Cada jogador usa seu próprio aparelho conectado na mesma rede local/Wi-Fi. Muito mais prático!</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

const LobbySetupScreen = ({
  onBack,
  playerName,
  setPlayerName,
  serverIp,
  setServerIp,
  isConnecting,
  errorMsg,
  handleConnect,
  gameMode,
}: {
  onBack: () => void;
  playerName: string;
  setPlayerName: (val: string) => void;
  serverIp: string;
  setServerIp: (val: string) => void;
  isConnecting: boolean;
  errorMsg: string;
  handleConnect: (customIp: string, actionType: 'create' | 'join', joinCode?: string) => void;
  gameMode: GameMode;
}) => {
  const [roomToJoin, setRoomToJoin] = useState('');
  const activeColorClass = gameMode === 'impostor' ? 'from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-600' : 'from-emerald-500 to-teal-650 hover:from-emerald-450 hover:to-teal-600';
  const ringColorClass = gameMode === 'impostor' ? 'focus:border-purple-550 focus:ring-purple-900/30' : 'focus:border-emerald-550 focus:ring-emerald-900/30';

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Configurar Multiplayer</span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center max-w-sm mx-auto w-full overflow-y-auto pb-12 gap-5">
        <div className="text-center mb-2">
          <div className="inline-flex p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 mb-3 animate-pulse">
            <Wifi size={32} />
          </div>
          <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Sala de Jogo</h2>
          <p className="text-slate-450 text-xs mt-1 font-medium">Preencha os dados e escolha se quer criar ou entrar.</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-950/20 border-2 border-red-500/20 text-red-400 rounded-2xl text-xs font-bold font-sans text-center animate-fade-in-scale">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 font-outfit">Seu Nome / Apelido</label>
            <input
              type="text"
              placeholder="Ex: Matheus"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
              className={`w-full bg-slate-900 border-2 border-white/5 px-4 py-3 rounded-2xl text-white font-bold placeholder:text-slate-650 outline-none transition-all ${ringColorClass}`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 font-outfit flex justify-between items-center">
              <span>IP do Computador Host</span>
              <span className="text-[9px] text-slate-500 normal-case">(Rodando server.js)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Server size={16} /></span>
              <input
                type="text"
                placeholder="Ex: 192.168.1.150 ou localhost"
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                className={`w-full bg-slate-900 border-2 border-white/5 pl-11 pr-4 py-3 rounded-2xl text-white font-mono text-sm placeholder:text-slate-650 outline-none transition-all ${ringColorClass}`}
              />
            </div>
          </div>

          <div className="h-px bg-white/5 my-2" />

          {/* Opção 1: Criar Sala */}
          <button
            onClick={() => handleConnect(serverIp, 'create')}
            disabled={!playerName.trim() || !serverIp.trim() || isConnecting}
            className={`w-full py-4 bg-gradient-to-r ${activeColorClass} disabled:from-slate-900 disabled:to-slate-900 disabled:text-slate-600 disabled:border-2 disabled:border-white/5 text-white font-black text-base rounded-2xl shadow-md transition-all active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 font-outfit`}
          >
            {isConnecting ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            <span>CRIAR NOVA SALA</span>
          </button>

          {/* Opção 2: Entrar em Sala Existente */}
          <div className="bg-slate-900/30 p-4 rounded-3xl border border-white/5 space-y-3 mt-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-1.5 font-outfit">Código da Sala</label>
              <input
                type="text"
                placeholder="Ex: ABCD"
                value={roomToJoin}
                onChange={(e) => setRoomToJoin(e.target.value.toUpperCase().slice(0, 4))}
                className={`w-full bg-slate-955 border-2 border-white/5 px-4 py-2.5 rounded-xl text-center text-xl font-black tracking-widest text-yellow-450 placeholder:text-slate-700 outline-none transition-all ${ringColorClass}`}
              />
            </div>
            <button
              onClick={() => handleConnect(serverIp, 'join', roomToJoin)}
              disabled={!playerName.trim() || !serverIp.trim() || roomToJoin.trim().length !== 4 || isConnecting}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-slate-850 text-white font-bold text-sm rounded-xl transition-all active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-2 border border-white/5 font-outfit"
            >
              {isConnecting ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              <span>ENTRAR NA SALA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MultiplayerLobbyScreen = ({
  onBack,
  roomCode,
  isHost,
  connectedPlayers,
  onStartGame,
  gameMode,
}: {
  onBack: () => void;
  roomCode: string;
  isHost: boolean;
  connectedPlayers: { id: string; name: string }[];
  onStartGame: () => void;
  gameMode: GameMode;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getThemeColorClass = () => {
    if (gameMode === 'impostor') return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getStartButtonClass = () => {
    if (gameMode === 'impostor') return 'bg-purple-600 hover:bg-purple-550';
    return 'bg-emerald-500 hover:bg-emerald-450';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-slate-100 relative h-full overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
        gameMode === 'impostor' ? 'bg-purple-600/10' : 'bg-emerald-500/10'
      }`} />

      {/* Header Fixo */}
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-350 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-black text-xl text-white font-outfit">Lobby Multiplayer</span>
        <div className={`text-xs font-black px-3 py-1.5 rounded-full font-outfit uppercase tracking-wider ${getThemeColorClass()}`}>
          {gameMode === 'impostor' ? 'Impostor' : 'Quem Sou Eu'}
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-w-sm mx-auto w-full justify-center">
        {/* Código Card */}
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 text-center shadow-xl relative overflow-hidden backdrop-blur-sm">
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-[0.2em] mb-1 font-outfit">Código da Sala</p>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl font-black text-yellow-450 font-outfit tracking-wider select-all">{roomCode}</h1>
            <button
              onClick={copyToClipboard}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all active:scale-90"
              title="Copiar código"
            >
              {copied ? (
                <span className="text-[10px] font-black text-emerald-400 font-outfit">COPIADO</span>
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-450 mt-2 font-medium">Compartilhe esse código com os seus amigos na mesma rede local.</p>
        </div>

        {/* Jogadores Conectados */}
        <div className="flex-1 flex flex-col bg-slate-900/20 rounded-3xl border border-white/5 overflow-hidden min-h-[180px]">
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
            <span className="text-xs font-black uppercase tracking-wider text-slate-350 font-outfit flex items-center gap-1.5">
              <Users size={14} /> Jogadores ({connectedPlayers.length})
            </span>
            {isHost && (
              <span className="text-[9px] font-bold text-yellow-400 border border-yellow-500/25 bg-yellow-500/5 px-2 py-0.5 rounded-full font-outfit uppercase">Você é o Líder</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {connectedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/40 border border-white/5 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-white font-outfit">
                    {index + 1}
                  </div>
                  <span className="font-bold text-sm text-slate-200">{player.name}</span>
                </div>
                {index === 0 ? (
                  <span className="text-[9px] font-black text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 font-outfit tracking-wide uppercase">
                    <Crown size={10} className="fill-yellow-400/20" /> Líder
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-450 bg-slate-850 px-2 py-1 rounded-lg font-outfit uppercase">Pronto</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé Interno com Ações */}
        <div className="mt-auto pt-2 shrink-0">
          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={connectedPlayers.length < (gameMode === 'impostor' ? 3 : 2)}
              className={`w-full py-4.5 text-white font-black text-lg rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:scale-100 disabled:bg-slate-900 disabled:text-slate-600 disabled:shadow-none flex items-center justify-center gap-2 font-outfit ${getStartButtonClass()}`}
            >
              <span>AVANÇAR PARA TEMAS</span> <ArrowRight size={20} />
            </button>
          ) : (
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center gap-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <p className="text-slate-450 text-xs font-bold uppercase tracking-wider font-outfit text-center">
                Aguardando o Líder iniciar...
              </p>
            </div>
          )}
          {isHost && connectedPlayers.length < (gameMode === 'impostor' ? 3 : 2) && (
            <p className="text-center text-red-400 text-[11px] font-black mt-2 font-outfit uppercase tracking-wider animate-pulse">
              {gameMode === 'impostor' ? 'Mínimo de 3 jogadores para o Impostor' : 'Mínimo de 2 jogadores para o Quem Sou Eu'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

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

  // --- ESTADOS DE MULTIPLAYER ---
  const [connectionType, setConnectionType] = useState<'local' | 'multiplayer'>('local');
  const [roomCode, setRoomCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [connectedPlayers, setConnectedPlayers] = useState<{ id: string; name: string }[]>([]);
  const [syncGameState, setSyncGameState] = useState<any>(null);
  const [serverIp, setServerIp] = useState('localhost');
  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Carregar configurações iniciais salvas
  useEffect(() => {
    const savedIp = localStorage.getItem('ito_multiplayer_ip');
    if (savedIp) {
      setServerIp(savedIp);
    }
    const savedName = localStorage.getItem('ito_player_name');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Limpa conexão ao desmontar
  useEffect(() => {
    return () => {
      syncService.disconnect();
    };
  }, []);

  const handleConnect = async (customIp: string, actionType: 'create' | 'join', joinCode?: string) => {
    setIsConnecting(true);
    setErrorMsg('');
    try {
      syncService.setServerUrl(customIp);
      await syncService.connect({
        onRoomCreated: (code, pId, playersList) => {
          setRoomCode(code);
          setPlayerId(pId);
          setIsHost(true);
          setConnectedPlayers(playersList);
          dispatch({ type: 'SET_SCREEN', screen: 'multiplayer-lobby' });
          setIsConnecting(false);
        },
        onRoomJoined: (code, pId, playersList, initialGameState) => {
          setRoomCode(code);
          setPlayerId(pId);
          setIsHost(false);
          setConnectedPlayers(playersList);
          setSyncGameState(initialGameState);
          dispatch({ type: 'SET_SCREEN', screen: 'multiplayer-lobby' });
          setIsConnecting(false);
        },
        onPlayerJoined: (playersList) => {
          setConnectedPlayers(playersList);
        },
        onPlayerLeft: (playersList) => {
          setConnectedPlayers(playersList);
        },
        onStateUpdated: (newGameState) => {
          setSyncGameState(newGameState);
          if (newGameState.screen) {
            dispatch({ type: 'SET_SCREEN', screen: newGameState.screen });
          }
        },
        onBecomeHost: () => {
          setIsHost(true);
        },
        onError: (msg) => {
          setErrorMsg(msg);
          setIsConnecting(false);
        }
      });

      // Salva no localStorage para conveniência
      localStorage.setItem('ito_multiplayer_ip', customIp);
      localStorage.setItem('ito_player_name', playerName);

      if (actionType === 'create') {
        syncService.createRoom(playerName);
      } else if (actionType === 'join' && joinCode) {
        syncService.joinRoom(joinCode, playerName);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Não foi possível conectar ao servidor.');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    syncService.disconnect();
    setRoomCode('');
    setConnectedPlayers([]);
    setSyncGameState(null);
    setIsHost(false);
    setConnectionType('local');
  };

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
     // ...
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
              } else {
                dispatch({ type: 'SET_SCREEN', screen: 'register-whoami' });
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
            serverIp={serverIp}
            setServerIp={setServerIp}
            isConnecting={isConnecting}
            errorMsg={errorMsg}
            handleConnect={handleConnect}
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
        );

      default:
        return <HomeScreen onPlay={() => dispatch({ type: 'GO_MODE_SELECTION' })} />;
    }
  };

  return (
    <div className="w-full h-full min-h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-hidden flex flex-col selection:bg-yellow-200 relative">
      {/* Container principal livre de barras de rolagem globais */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        {renderScreen()}
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