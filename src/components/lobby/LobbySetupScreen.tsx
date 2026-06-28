import { useState } from 'react';
import { ChevronLeft, Plus, RefreshCw, LogIn, Wifi } from 'lucide-react';
import type { GameMode } from '../../App';

export const LobbySetupScreen = ({
  onBack,
  playerName,
  setPlayerName,
  isConnecting,
  handleConnect,
  gameMode,
}: {
  onBack: () => void;
  playerName: string;
  setPlayerName: (val: string) => void;
  isConnecting: boolean;
  handleConnect: (customIp: string, actionType: 'create' | 'join', joinCode?: string) => void;
  gameMode: GameMode;
}) => {
  const [roomToJoin, setRoomToJoin] = useState('');
  const activeColorClass = gameMode === 'impostor' 
    ? 'from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-600' 
    : gameMode === 'classic'
      ? 'from-yellow-400 to-amber-500 hover:from-yellow-350 hover:to-amber-450 text-black font-black'
      : 'from-emerald-500 to-teal-650 hover:from-emerald-450 hover:to-teal-600';
  const ringColorClass = gameMode === 'impostor' 
    ? 'focus:border-purple-550 focus:ring-purple-900/30' 
    : gameMode === 'classic'
      ? 'focus:border-yellow-550 focus:ring-yellow-900/30'
      : 'focus:border-emerald-550 focus:ring-emerald-900/30';

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button aria-label="Voltar" onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Configurar Sala</span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center max-w-sm mx-auto w-full overflow-y-auto pb-12 gap-5">
        <div className="text-center mb-2">
          <div className="inline-flex p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 mb-3 animate-pulse">
            <Wifi size={32} />
          </div>
          <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Multiplayer P2P</h2>
          <p className="text-slate-450 text-xs mt-1 font-medium">Jogue direto pelo seu celular sem fio via rede local.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1.5 font-outfit">Seu Nome / Apelido</label>
            <input
              id="playerName"
              type="text"
              placeholder="Ex: Matheus"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
              className={`w-full bg-slate-900 border-2 border-white/5 px-4 py-3 rounded-2xl text-white font-bold placeholder:text-slate-650 outline-none transition-all ${ringColorClass}`}
            />
          </div>

          <div className="h-px bg-white/5 my-2" />

          {/* Opção 1: Criar Sala */}
          <button
            onClick={() => handleConnect('', 'create')}
            disabled={!playerName.trim() || isConnecting}
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
              <label htmlFor="roomCode" className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-1.5 font-outfit">Código da Sala</label>
              <input
                id="roomCode"
                type="text"
                placeholder="Ex: ABCD"
                value={roomToJoin}
                onChange={(e) => setRoomToJoin(e.target.value.toUpperCase().slice(0, 4))}
                className={`w-full bg-slate-955 border-2 border-white/5 px-4 py-2.5 rounded-xl text-center text-xl font-black tracking-widest text-yellow-450 placeholder:text-slate-700 outline-none transition-all ${ringColorClass}`}
              />
            </div>
            <button
              onClick={() => handleConnect('', 'join', roomToJoin)}
              disabled={!playerName.trim() || roomToJoin.trim().length !== 4 || isConnecting}
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
