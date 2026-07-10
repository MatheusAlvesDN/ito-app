import { useState } from 'react';
import { ChevronLeft, Copy, Users, Crown, ArrowRight, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import type { GameMode } from '../../App';

export const MultiplayerLobbyScreen = ({
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
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareRoomLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?room=${roomCode}&mode=${gameMode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Junte-se à minha partida no Party Games!',
        text: `Entre na sala ${roomCode} para jogar comigo!`,
        url: link,
      }).catch(err => console.log('Share failed', err));
    } else {
      navigator.clipboard.writeText(link);
      toast.success('Link de convite copiado para área de transferência!');
    }
  };

  const getThemeColorClass = () => {
    if (gameMode === 'impostor') return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    if (gameMode === 'classic') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getStartButtonClass = () => {
    if (gameMode === 'impostor') return 'bg-purple-600 hover:bg-purple-550';
    if (gameMode === 'classic') return 'bg-yellow-400 hover:bg-yellow-350 text-black';
    return 'bg-emerald-500 hover:bg-emerald-450';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-slate-100 relative h-full overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
        gameMode === 'impostor' ? 'bg-purple-600/10' : gameMode === 'classic' ? 'bg-yellow-550/10' : 'bg-emerald-500/10'
      }`} />

      {/* Header Fixo */}
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-355 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-black text-xl text-white font-outfit">Lobby Multiplayer</span>
        <div className={`text-xs font-black px-3 py-1.5 rounded-full font-outfit uppercase tracking-wider ${getThemeColorClass()}`}>
          {gameMode === 'impostor' ? 'Impostor' : gameMode === 'classic' ? 'ITO Clássico' : 'Quem Sou Eu'}
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-w-sm mx-auto w-full justify-center">
        {/* Código Card */}
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/5 text-center shadow-xl relative overflow-hidden backdrop-blur-sm">
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-[0.2em] mb-1 font-outfit">Código da Sala</p>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-5xl font-black text-yellow-455 font-outfit tracking-wider select-all">{roomCode}</h1>
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
          <button
            onClick={shareRoomLink}
            className="mt-3.5 w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-white/5 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all font-outfit uppercase tracking-wider"
          >
            <Share2 size={14} /> Convidar Amigos (Link)
          </button>
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
              <p className="text-slate-455 text-xs font-bold uppercase tracking-wider font-outfit text-center">
                Aguardando o Líder iniciar...
              </p>
            </div>
          )}
          {isHost && connectedPlayers.length < (gameMode === 'impostor' ? 3 : 2) && (
            <p className="text-center text-red-400 text-[11px] font-black mt-2 font-outfit uppercase tracking-wider animate-pulse">
              {gameMode === 'impostor' ? 'Mínimo de 3 jogadores para o Impostor' : 'Mínimo de 2 jogadores para iniciar'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
