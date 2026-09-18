import { useState } from 'react';
import { ChevronLeft, Copy, Users, Crown, ArrowRight, Share2, QrCode, X, Sparkles, Zap, Ghost, UserSearch, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { GameMode } from '../../App';

const AVAILABLE_MODES: {
  id: GameMode;
  title: string;
  subtitle: string;
  minPlayers: number;
  tag: string;
  color: string;
  activeBorder: string;
  activeBg: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  {
    id: 'classic',
    title: 'ITO Clássico',
    subtitle: 'Ordene números em equipe',
    minPlayers: 2,
    tag: 'Coop',
    color: 'text-yellow-400',
    activeBorder: 'border-yellow-400/80',
    activeBg: 'bg-yellow-400/10',
    icon: Zap,
  },
  {
    id: 'impostor',
    title: 'Impostor',
    subtitle: 'Descubra quem não sabe o tema',
    minPlayers: 3,
    tag: 'Bluff',
    color: 'text-purple-400',
    activeBorder: 'border-purple-400/80',
    activeBg: 'bg-purple-400/10',
    icon: Ghost,
  },
  {
    id: 'whoami',
    title: 'Quem Sou Eu?',
    subtitle: 'Adivinhe seu personagem',
    minPlayers: 2,
    tag: 'Casual',
    color: 'text-emerald-400',
    activeBorder: 'border-emerald-400/80',
    activeBg: 'bg-emerald-400/10',
    icon: UserSearch,
  },
  {
    id: 'whatdoyouknow',
    title: 'O Que Você Sabe?',
    subtitle: 'Adivinhe a resposta do amigo',
    minPlayers: 3,
    tag: 'Party',
    color: 'text-rose-400',
    activeBorder: 'border-rose-400/80',
    activeBg: 'bg-rose-400/10',
    icon: HelpCircle,
  },
];

export const MultiplayerLobbyScreen = ({
  onBack,
  roomCode,
  isHost,
  connectedPlayers,
  onStartGame,
  gameMode,
  onSelectGameMode,
}: {
  onBack: () => void;
  roomCode: string;
  isHost: boolean;
  connectedPlayers: { id: string; name: string }[];
  onStartGame: () => void;
  gameMode: GameMode;
  onSelectGameMode?: (mode: GameMode) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const selectedModeConfig = AVAILABLE_MODES.find(m => m.id === gameMode) || AVAILABLE_MODES[0];
  const minRequired = selectedModeConfig.minPlayers;
  const canStart = connectedPlayers.length >= minRequired;

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
    if (gameMode === 'whatdoyouknow') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (gameMode === 'translator') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getStartButtonClass = () => {
    if (gameMode === 'impostor') return 'bg-purple-600 hover:bg-purple-550';
    if (gameMode === 'classic') return 'bg-yellow-400 hover:bg-yellow-350 text-black';
    if (gameMode === 'whatdoyouknow') return 'bg-rose-500 hover:bg-rose-450';
    if (gameMode === 'translator') return 'bg-blue-500 hover:bg-blue-450';
    return 'bg-emerald-500 hover:bg-emerald-450';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-slate-100 relative h-full overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-colors duration-500 ${
        gameMode === 'impostor' ? 'bg-purple-600/10' :
        gameMode === 'classic' ? 'bg-yellow-550/10' :
        gameMode === 'whatdoyouknow' ? 'bg-rose-550/10' :
        'bg-emerald-500/10'
      }`} />

      {/* Header Fixo */}
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-355 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-black text-xl text-white font-outfit">Lobby Multiplayer</span>
        <div className={`text-xs font-black px-3 py-1.5 rounded-full font-outfit uppercase tracking-wider transition-all duration-300 ${getThemeColorClass()}`}>
          {selectedModeConfig.title}
        </div>
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-5 max-w-sm mx-auto w-full">
        {/* Código Card */}
        <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 text-center shadow-xl relative overflow-hidden backdrop-blur-sm">
          <p className="text-[10px] font-black text-slate-450 uppercase tracking-[0.2em] mb-1 font-outfit">Código da Sala</p>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl sm:text-5xl font-black text-yellow-455 font-outfit tracking-wider select-all">{roomCode}</h1>
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
          <p className="text-[11px] text-slate-450 mt-1.5 font-medium">Compartilhe esse código ou o QR Code com seus amigos.</p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={shareRoomLink}
              className="py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-white/5 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all font-outfit uppercase tracking-wider"
            >
              <Share2 size={14} /> Link
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="py-2.5 bg-slate-800 hover:bg-slate-750 text-yellow-400 border border-yellow-500/20 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all font-outfit uppercase tracking-wider"
            >
              <QrCode size={14} /> QR Code
            </button>
          </div>
        </div>

        {/* Seletor / Exibição do Modo de Jogo */}
        <div className="bg-slate-900/60 p-4 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-350 font-outfit flex items-center gap-1.5">
              <Sparkles size={14} className="text-yellow-400" /> Escolha o Modo
            </span>
            {isHost ? (
              <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full font-outfit">
                Você escolhe
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full font-outfit">
                Definido pelo Líder
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_MODES.map((m) => {
              const isSelected = gameMode === m.id;
              const IconComponent = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={!isHost}
                  onClick={() => onSelectGameMode && onSelectGameMode(m.id)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between min-h-[76px] ${
                    isSelected
                      ? `${m.activeBorder} ${m.activeBg} shadow-md scale-[1.02]`
                      : 'border-white/5 bg-slate-900/40 hover:border-white/10 opacity-60 hover:opacity-85'
                  } ${isHost ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <IconComponent size={14} className={isSelected ? m.color : 'text-slate-400'} />
                      <span className={`font-black text-xs font-outfit leading-tight ${isSelected ? m.color : 'text-slate-200'}`}>
                        {m.title}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-medium">
                    <span>Mín. {m.minPlayers}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md font-outfit ${isSelected ? 'bg-white/15 ' + m.color : 'bg-slate-800 text-slate-400'}`}>
                      {m.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Jogadores Conectados */}
        <div className="flex flex-col bg-slate-900/20 rounded-3xl border border-white/5 overflow-hidden min-h-[140px]">
          <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
            <span className="text-xs font-black uppercase tracking-wider text-slate-350 font-outfit flex items-center gap-1.5">
              <Users size={14} /> Jogadores ({connectedPlayers.length})
            </span>
            {isHost && (
              <span className="text-[9px] font-bold text-yellow-400 border border-yellow-500/25 bg-yellow-500/5 px-2 py-0.5 rounded-full font-outfit uppercase">Você é o Líder</span>
            )}
          </div>

          <div className="p-3 space-y-2 max-h-[180px] overflow-y-auto">
            {connectedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/40 border border-white/5 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-black text-white font-outfit">
                    {index + 1}
                  </div>
                  <span className="font-bold text-sm text-slate-200">{player.name}</span>
                </div>
                {index === 0 ? (
                  <span className="text-[9px] font-black text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 font-outfit tracking-wide uppercase">
                    <Crown size={10} className="fill-yellow-400/20" /> Líder
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-450 bg-slate-850 px-2 py-0.5 rounded-lg font-outfit uppercase">Pronto</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé Interno com Ações */}
        <div className="mt-auto pt-1 pb-4 shrink-0">
          {isHost ? (
            <button
              onClick={onStartGame}
              disabled={!canStart}
              className={`w-full py-4 text-white font-black text-base rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:scale-100 disabled:bg-slate-900 disabled:text-slate-600 disabled:shadow-none flex items-center justify-center gap-2 font-outfit ${getStartButtonClass()}`}
            >
              <span>AVANÇAR PARA TEMAS</span> <ArrowRight size={18} />
            </button>
          ) : (
            <div className="p-3.5 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center justify-center gap-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <p className="text-slate-455 text-xs font-bold uppercase tracking-wider font-outfit text-center">
                Aguardando o Líder iniciar...
              </p>
            </div>
          )}
          {isHost && !canStart && (
            <p className="text-center text-red-400 text-[11px] font-black mt-2 font-outfit uppercase tracking-wider animate-pulse">
              Mínimo de {minRequired} jogadores para {selectedModeConfig.title}
            </p>
          )}
        </div>
      </div>

      {/* Modal QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
            <p className="text-xs font-black uppercase text-yellow-400 tracking-widest font-outfit mb-1">Entrar na Sala</p>
            <h3 className="text-xl font-bold text-white mb-4">Aponte a câmera para entrar</h3>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${window.location.origin}${window.location.pathname}?room=${roomCode}&mode=${gameMode}`
                )}`}
                alt="QR Code da Sala"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-xs text-slate-400 mb-4">Ou digite o código <span className="text-yellow-400 font-black">{roomCode}</span> no aplicativo.</p>
            <button
              onClick={() => {
                shareRoomLink();
                setShowQrModal(false);
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl uppercase font-outfit"
            >
              Copiar Link Direto
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
