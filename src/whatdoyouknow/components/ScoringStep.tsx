import { ChevronLeft, CheckCircle } from 'lucide-react';

type Props = {
  onBack: () => void;
  targetPlayer: string;
  isMultiplayer: boolean;
  isHost: boolean;
  guessingPlayers: string[];
  selectedWinners: Set<string>;
  toggleWinner: (playerName: string) => void;
  handleConfirmScores: () => void;
};

export default function ScoringStep({
  onBack,
  targetPlayer,
  isMultiplayer,
  isHost,
  guessingPlayers,
  selectedWinners,
  toggleWinner,
  handleConfirmScores
}: Props) {
  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-white relative h-full overflow-hidden font-sans">
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="font-black text-xl text-white font-outfit">Pontuação</span>
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-white font-outfit mb-2">Quem Acertou?</h1>
          <p className="text-sm text-slate-400 font-medium">
            Marque todos os jogadores que acertaram a resposta de <strong className="text-rose-400">{targetPlayer}</strong>.
          </p>
        </div>

        {(!isMultiplayer || isHost) ? (
          <div className="space-y-3 mb-6">
            {guessingPlayers.map((player) => {
              const isWinner = selectedWinners.has(player);
              return (
                <div
                  key={player}
                  onClick={() => toggleWinner(player)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden relative ${isWinner
                    ? 'bg-rose-500/10 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/40 border-white/5 hover:border-rose-500/30'
                    }`}
                >
                  {isWinner && (
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 via-rose-500/5 to-rose-500/0 animate-pulse" />
                  )}
                  <span className={`font-bold text-lg font-outfit relative z-10 ${isWinner ? 'text-rose-400' : 'text-slate-200'}`}>
                    {player}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border-2 relative z-10 ${isWinner ? 'bg-rose-500 border-rose-500 text-white scale-110' : 'border-slate-600 text-transparent'
                    }`}>
                    <CheckCircle size={16} strokeWidth={3} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 text-center animate-pulse">
              <CheckCircle size={48} className="text-rose-500/50 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-outfit text-white mb-2">Aguardando Avaliação</h3>
              <p className="text-sm text-slate-400">O líder está registrando quem acertou a resposta.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.4)] z-20">
        {(!isMultiplayer || isHost) && (
          <button onClick={handleConfirmScores} className="w-full bg-rose-600 hover:bg-rose-550 text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit">
            <span>CONFIRMAR PONTOS</span> <CheckCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
