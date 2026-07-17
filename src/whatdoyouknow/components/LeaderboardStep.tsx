import { ChevronLeft, Trophy, Play } from 'lucide-react';
import { ReactionsOverlay, ReactionsTray } from '../../components/ReactionsOverlay';

type Props = {
  onBack: () => void;
  activePlayers: string[];
  scores: Record<string, number>;
  isMultiplayer: boolean;
  isHost: boolean;
  handleNextRound: () => void;
};

export default function LeaderboardStep({
  onBack,
  activePlayers,
  scores,
  isMultiplayer,
  isHost,
  handleNextRound
}: Props) {
  const sortedPlayers = [...activePlayers].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
  const highestScore = scores[sortedPlayers[0]] || 0;

  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-white relative h-full overflow-hidden font-sans">
      <ReactionsOverlay />
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-black text-xl text-white font-outfit">Placar</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-4 border border-rose-500/30">
            <Trophy size={40} className="text-rose-400" />
          </div>
          <h1 className="text-3xl font-black text-white font-outfit">Ranking</h1>
        </div>

        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const playerScore = scores[player] || 0;
            // Se tiver a mesma pontuação do primeiro e for > 0, também é considerado primeiro lugar (empate)
            const isFirstPlace = playerScore > 0 && playerScore === highestScore;
            
            return (
              <div
                key={player}
                className={`flex items-center justify-between p-4 rounded-2xl border ${isFirstPlace
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-900/40 border-white/5'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-black text-xl font-outfit ${isFirstPlace ? 'text-amber-400' : 'text-slate-500'}`}>
                    {index + 1}
                  </span>
                  <span className={`font-bold text-lg font-outfit ${isFirstPlace ? 'text-white' : 'text-slate-200'}`}>
                    {player}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-955 px-3 py-1.5 rounded-lg border border-white/5">
                  <span className="font-black text-rose-400 font-outfit">{playerScore}</span>
                  <span className="text-[10px] text-slate-450 uppercase font-bold">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-slate-900 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.4)] z-20">
        {(!isMultiplayer || isHost) ? (
          <button onClick={handleNextRound} className="w-full bg-rose-600 hover:bg-rose-550 text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit">
            <span>PRÓXIMA RODADA</span> <Play size={20} />
          </button>
        ) : (
          <div className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">Aguardando líder iniciar nova rodada...</span>
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
