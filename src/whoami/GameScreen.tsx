import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Circle, Eye, EyeOff, RotateCcw, Trophy, Home, UserSearch, ArrowRight } from 'lucide-react';
import { type WhoAmITheme } from './data';

type Props = {
  onBack: () => void;
  players: string[];
  themes: WhoAmITheme[];
};

type PlayerData = {
  name: string;
  personality: string;
  guessedCorrectly: boolean;
};

export default function GameScreenWhoAmI({ onBack, players, themes }: Props) {
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const [phase, setPhase] = useState<'reveal' | 'scoring' | 'ended'>('reveal');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealStep, setRevealStep] = useState<'hidden' | 'showing'>('hidden');

  // Initialize game
  const startGame = () => {
    // Gather personalities from chosen themes
    let allPersonalities = themes.flatMap(t => t.personalities);
    
    // Shuffle
    allPersonalities = [...allPersonalities].sort(() => 0.5 - Math.random());
    
    // Ensure we have enough (repeat if extremely necessary, though themes are large)
    let selected: string[] = [];
    while (selected.length < players.length && allPersonalities.length > 0) {
      selected = selected.concat(allPersonalities);
    }
    selected = selected.slice(0, players.length);
    
    const initialData: PlayerData[] = players.map((p, i) => ({
      name: p,
      personality: selected[i],
      guessedCorrectly: false,
    }));
    
    setPlayerData(initialData);
    setPhase('reveal');
    setCurrentIndex(0);
    setRevealStep('hidden');
  };

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, themes]);

  const handleReveal = () => setRevealStep('showing');

  const handleNextReveal = () => {
    if (currentIndex < players.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealStep('hidden');
    } else {
      setPhase('scoring');
    }
  };

  const toggleGuess = (index: number) => {
    setPlayerData((prev) => {
      const copy = [...prev];
      copy[index].guessedCorrectly = !copy[index].guessedCorrectly;
      return copy;
    });
  };

  // ------------------------------------------------------------------
  // RENDER ENDED
  // ------------------------------------------------------------------
  if (phase === 'ended') {
    return (
      <div className="flex-1 flex flex-col bg-teal-900 text-white h-full relative overflow-hidden">
        <div className="flex-1 p-6 flex flex-col items-center justify-center animate-fade-in z-10">
          <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-lg" />
          <h2 className="text-4xl font-black mb-2 text-center">Fim da Rodada!</h2>
          <p className="text-teal-200 mb-8 text-center text-lg">Confira quem conseguiu adivinhar:</p>

          <div className="w-full max-w-md space-y-4 mb-8 overflow-y-auto max-h-[50vh] pr-2">
            {playerData.map((p, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-2xl flex items-center justify-between border-2 ${
                  p.guessedCorrectly 
                    ? 'bg-emerald-800/50 border-emerald-500' 
                    : 'bg-red-900/30 border-red-500/50'
                }`}
              >
                <div>
                  <p className="font-bold text-xl">{p.name}</p>
                  <p className="text-sm opacity-80 mt-1">Era: <span className="font-bold text-white">{p.personality}</span></p>
                </div>
                {p.guessedCorrectly ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-900/50 px-3 py-1 rounded-full">
                    <CheckCircle2 size={18} /> Acertou
                  </div>
                ) : (
                  <div className="text-red-400 font-bold text-sm bg-red-950/50 px-3 py-1 rounded-full border border-red-500/30">
                    Errou
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md mt-auto pb-8">
            <button
              onClick={startGame}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <RotateCcw size={24} /> Jogar Novamente
            </button>
            <button
              onClick={onBack}
              className="w-full bg-teal-800 hover:bg-teal-700 text-white font-bold text-lg py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 border border-teal-600"
            >
              <Home size={20} /> Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER REVEAL PHASE
  // ------------------------------------------------------------------
  if (phase === 'reveal') {
    const currentPlayer = playerData[currentIndex];
    
    if (!currentPlayer) return null; // safety check
    
    return (
      <div className="flex-1 flex flex-col bg-slate-100 relative h-full">
        {/* Header */}
        <div className="p-4 flex items-center bg-teal-600 shadow-md sticky top-0 z-20 pt-8 md:pt-4 safe-top text-white">
          <button onClick={onBack} className="p-2 bg-teal-700/50 rounded-full hover:bg-teal-700 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="ml-4 flex-1">
            <span className="font-black text-lg tracking-wide uppercase">Revelando</span>
          </div>
          <div className="text-sm font-bold bg-teal-800/50 px-3 py-1 rounded-full">
            {currentIndex + 1} de {players.length}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
          {revealStep === 'hidden' ? (
            <>
              <UserSearch size={80} className="text-teal-300 drop-shadow-sm mb-4" />
              <h2 className="text-3xl font-black text-slate-800 mb-2">Vez de {currentPlayer.name}</h2>
              <div className="bg-red-100 border-2 border-red-400 rounded-2xl p-6 shadow-md max-w-sm w-full">
                <p className="text-red-700 font-bold text-lg mb-2 flex items-center justify-center gap-2 uppercase tracking-wide">
                  <EyeOff size={24} /> Atenção!
                </p>
                <p className="text-red-900 font-medium">
                  <span className="font-black text-xl">{currentPlayer.name}</span>, não olhe a tela!<br/>
                  (Ou coloque o celular na testa).<br/><br/>
                  Os outros jogadores devem memorizar quem é esta pessoa.
                </p>
              </div>
              <button
                onClick={handleReveal}
                className="w-full max-w-sm mt-8 py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-colors shadow-lg active:scale-95 border-b-4 border-teal-800"
              >
                <Eye size={28} /> Revelar Personagem
              </button>
            </>
          ) : (
            <>
              <div className="w-full max-w-sm bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden animate-fade-in-down">
                <div className="absolute opacity-10 top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                   <UserSearch size={250} />
                </div>
                <p className="text-teal-100 font-bold uppercase tracking-wider mb-2 relative z-10 text-sm">
                  {currentPlayer.name} é:
                </p>
                <p className="text-4xl sm:text-5xl font-black relative z-10 drop-shadow-md leading-tight">
                  {currentPlayer.personality}
                </p>
              </div>
              
              <button
                onClick={handleNextReveal}
                className="w-full max-w-sm mt-8 py-5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-colors shadow-lg active:scale-95 border-b-4 border-emerald-700"
              >
                Continuar <ArrowRight size={28} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER SCORING PHASE
  // ------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col bg-slate-100 relative h-full">
      {/* Header */}
      <div className="p-4 flex items-center bg-teal-600 shadow-md sticky top-0 z-20 pt-8 md:pt-4 safe-top text-white">
        <button onClick={onBack} className="p-2 bg-teal-700/50 rounded-full hover:bg-teal-700 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="ml-4 flex-1">
          <span className="font-black text-lg tracking-wide uppercase">Pontuação</span>
        </div>
      </div>

      <div className="p-4 bg-teal-50 border-b border-teal-200">
        <p className="text-teal-800 text-center font-medium">Deem as dicas! Quem for adivinhando o se personagem ganha os pontos.</p>
      </div>

      {/* Players List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {playerData.map((p, index) => {
          return (
            <div key={index} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-2xl text-slate-800">{p.name}</span>
              
              <button
                onClick={() => toggleGuess(index)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all shadow-sm ${
                  p.guessedCorrectly 
                    ? 'bg-emerald-500 text-white border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1' 
                    : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200 active:scale-95'
                }`}
              >
                {p.guessedCorrectly ? <CheckCircle2 size={24} className="fill-emerald-200"/> : <Circle size={24} />}
                <span className="font-bold uppercase tracking-wide">Acertou</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer / End Round */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0 safe-bottom pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setPhase('ended')}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Finalizar Rodada <ChevronLeft className="rotate-180" size={24} />
        </button>
      </div>
    </div>
  );
}
