import { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, MessageCircle, Volume2, VolumeX, Clock } from 'lucide-react';
import { ReactionsOverlay, ReactionsTray } from '../../components/ReactionsOverlay';

type Props = {
  onBack: () => void;
  toggleMute: () => void;
  isMuted: boolean;
  targetPlayer: string;
  question: string;
  isMultiplayer: boolean;
  isHost: boolean;
  isMyTurn: boolean;
  handleGoToScoring: () => void;
};

export default function QuestionStep({
  onBack,
  toggleMute,
  isMuted,
  targetPlayer,
  question,
  isMultiplayer,
  isHost,
  isMyTurn,
  handleGoToScoring
}: Props) {
  // Timer lógico de 60s
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(60);
  }, [question]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const progress = (timeLeft / 60) * 100;

  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-slate-100 relative h-full overflow-hidden font-sans">
      <ReactionsOverlay />
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button onClick={toggleMute} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-355 transition-colors">
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-2">
           <Clock size={16} className="text-rose-400" />
           <span className="text-rose-400 font-bold font-outfit">{timeLeft}s</span>
        </div>
      </div>

      {/* Barra de progresso no topo */}
      <div className="w-full h-1 bg-slate-900 absolute top-[72px] md:top-[64px] z-20">
        <div 
          className="h-full bg-rose-500 transition-all duration-1000 ease-linear" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <div className="flex-1 flex flex-col p-6 items-center justify-center overflow-y-auto z-10">
        <div className="mb-6 text-center animate-fade-in">
          <p className="text-slate-450 text-xs font-bold uppercase tracking-wider mb-2 font-outfit">Jogador da Vez</p>
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
            <h1 className="text-4xl font-black text-white font-outfit relative z-10">{targetPlayer}</h1>
          </div>
        </div>

        <div className="w-full max-w-sm bg-slate-900/60 p-8 rounded-3xl border border-white/5 shadow-2xl relative text-center">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-rose-500 p-3 rounded-2xl shadow-lg shadow-rose-500/20">
            <HelpCircle size={32} className="text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-6 font-outfit leading-snug">
            "{question}"
          </h2>

          <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/10">
            <p className="text-sm font-medium text-rose-200">
              Os outros jogadores devem tentar adivinhar a resposta exata de <strong className="text-white">{targetPlayer}</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.4)] z-20">
        {(!isMultiplayer || isHost) ? (
          <button onClick={handleGoToScoring} className="w-full bg-rose-600 hover:bg-rose-550 text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit">
            <span>AVALIAÇÃO DE PONTOS</span> <MessageCircle size={20} />
          </button>
        ) : (
          <div className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">
              {isMyTurn ? 'Revele sua resposta para o grupo!' : 'Dê seu palpite em voz alta!'}
            </span>
          </div>
        )}
      </div>
      {isMultiplayer && (
        <div className="absolute bottom-28 left-0 right-0 flex justify-center z-45 pointer-events-none">
          <ReactionsTray />
        </div>
      )}
    </div>
  );
}
