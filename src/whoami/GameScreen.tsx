import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Circle, Eye, EyeOff, RotateCcw, Trophy, Home, UserSearch, ArrowRight } from 'lucide-react';
import { type WhoAmITheme } from './data';
import { syncService, triggerVibration } from '../utils/syncService';

type Props = {
  onBack: () => void;
  players: string[];
  themes: WhoAmITheme[];
  isMultiplayer?: boolean;
  isHost?: boolean;
  syncGameState?: any;
  playerId?: string;
  connectedPlayers?: { id: string; name: string }[];
};

type PlayerData = {
  id?: string;
  name: string;
  personality: string;
  guessedCorrectly: boolean;
};

export default function GameScreenWhoAmI({
  onBack,
  players,
  themes,
  isMultiplayer = false,
  isHost = false,
  syncGameState = null,
  playerId = '',
  connectedPlayers = [],
}: Props) {
  // --- LOCAL STATES ---
  const [localPlayerData, setLocalPlayerData] = useState<PlayerData[]>([]);
  const [localPhase, setLocalPhase] = useState<'reveal' | 'scoring' | 'ended'>('reveal');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealStep, setRevealStep] = useState<'hidden' | 'showing'>('hidden');

  // --- LOCAL PEAK/REVEAL OPTION FOR MULTIPLAYER ---
  const [revealedMyOwn, setRevealedMyOwn] = useState(false);

  // --- DERIVED MULTIPLAYER STATES ---
  const phase = isMultiplayer ? (syncGameState?.phase || 'playing') : localPhase;
  const playerData = isMultiplayer ? (syncGameState?.playerData || []) : localPlayerData;

  // --- TIMER STATE & EFFECTS ---
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (phase !== 'ended') {
      setTimeLeft(120);
      setTimerActive(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'ended' || !timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          triggerVibration([200, 100, 200, 100, 400]); // Alarme vibratório!
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timerActive, timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getThemePersonalities = (t: WhoAmITheme) => {
    if (t.id.startsWith('custom_theme_')) {
      try {
        const saved = localStorage.getItem('whoami_custom_personalities_' + t.id);
        return saved ? JSON.parse(saved) : (t.personalities || []);
      } catch {
        return t.personalities || [];
      }
    }
    return t.personalities || [];
  };

  // Initialize game
  const startGame = () => {
    // Gather personalities from chosen themes
    let allPersonalities = themes.flatMap(t => getThemePersonalities(t));
    
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
    
    setLocalPlayerData(initialData);
    setLocalPhase('reveal');
    setCurrentIndex(0);
    setRevealStep('hidden');
  };

  const startMultiplayerGame = () => {
    if (!connectedPlayers || connectedPlayers.length < 2) return;

    // Gather personalities
    let allPersonalities = themes.flatMap(t => getThemePersonalities(t));
    allPersonalities = [...allPersonalities].sort(() => 0.5 - Math.random());

    let selected: string[] = [];
    while (selected.length < connectedPlayers.length && allPersonalities.length > 0) {
      selected = selected.concat(allPersonalities);
    }
    selected = selected.slice(0, connectedPlayers.length);

    const initialData: PlayerData[] = connectedPlayers.map((player, i) => ({
      id: player.id,
      name: player.name,
      personality: selected[i],
      guessedCorrectly: false,
    }));

    setRevealedMyOwn(false);

    // Sync playing phase directly
    syncService.syncState({
      phase: 'playing',
      playerData: initialData
    });
  };

  useEffect(() => {
    if (!isMultiplayer) {
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, themes]);

  useEffect(() => {
    if (isMultiplayer && isHost && syncGameState?.phase === 'setup') {
      startMultiplayerGame();
    }
  }, [isHost, isMultiplayer, syncGameState?.phase, syncGameState?.roundKey]);

  const handleReveal = () => {
    setRevealStep('showing');
    triggerVibration(100);
  };

  const handleNextReveal = () => {
    if (currentIndex < players.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealStep('hidden');
    } else {
      setLocalPhase('scoring');
    }
  };

  const toggleGuess = (index: number) => {
    triggerVibration(60);
    if (isMultiplayer) {
      const copy = [...playerData];
      copy[index].guessedCorrectly = !copy[index].guessedCorrectly;
      syncService.syncState({ playerData: copy });
    } else {
      setLocalPlayerData((prev) => {
        const copy = [...prev];
        copy[index].guessedCorrectly = !copy[index].guessedCorrectly;
        return copy;
      });
    }
  };

  const handlePlayAgain = () => {
    if (isMultiplayer) {
      syncService.syncState({
        phase: 'setup',
        roundKey: Date.now()
      });
    } else {
      startGame();
    }
  };

  const handleEndRound = () => {
    if (isMultiplayer) {
      syncService.syncState({ phase: 'ended' });
    } else {
      setLocalPhase('ended');
    }
  };

  // ------------------------------------------------------------------
  // RENDER ENDED
  // ------------------------------------------------------------------
  if (phase === 'ended') {
    return (
      <div className="flex-1 flex flex-col bg-slate-955 text-white h-full relative overflow-hidden font-sans">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Área Central Rolável */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center animate-fade-in z-10 overflow-y-auto">
          <div className="bg-slate-900 border border-white/5 p-6 rounded-full mb-4 shadow-xl">
            <Trophy size={64} className="text-yellow-450 drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-black mb-1 text-center font-outfit">Fim da Rodada!</h2>
          <p className="text-slate-400 mb-6 text-center text-sm font-medium">Veja quem conseguiu adivinhar o personagem:</p>

          <div className="w-full max-w-md space-y-3 mb-6 overflow-y-auto max-h-[45vh] pr-1">
            {playerData.map((p: PlayerData, i: number) => (
              <div 
                key={i} 
                className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all duration-200 ${
                  p.guessedCorrectly 
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm' 
                    : 'bg-red-950/10 border-red-500/20 opacity-80'
                }`}
              >
                <div>
                  <p className="font-bold text-lg font-outfit text-white">{p.name}</p>
                  <p className="text-xs text-slate-455 mt-0.5 font-medium">Era: <span className="font-bold text-slate-200">{p.personality}</span></p>
                </div>
                {p.guessedCorrectly ? (
                  <div className="flex items-center gap-1 text-emerald-455 font-black text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-outfit uppercase tracking-wider">
                    <CheckCircle2 size={14} className="fill-emerald-400/20" /> Acertou
                  </div>
                ) : (
                  <div className="text-red-400 font-bold text-xs bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full font-outfit uppercase tracking-wider">
                    Errou
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 w-full max-w-md mt-auto pt-4 shrink-0">
            {(!isMultiplayer || isHost) ? (
              <button
                onClick={handlePlayAgain}
                className="w-full bg-emerald-500 hover:bg-emerald-450 text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit"
              >
                <RotateCcw size={20} /> Jogar Novamente
              </button>
            ) : (
              <div className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">Aguardando líder reiniciar...</span>
              </div>
            )}
            <button
              onClick={onBack}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-350 font-bold text-base py-3.5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/5 font-outfit"
            >
              <Home size={18} /> Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER REVEAL PHASE (Only local single phone mode goes here)
  // ------------------------------------------------------------------
  if (!isMultiplayer && phase === 'reveal') {
    const currentPlayer = playerData[currentIndex];
    
    if (!currentPlayer) return null; // safety check
    
    return (
      <div className="flex-1 flex flex-col bg-slate-955 text-white relative h-full overflow-hidden font-sans">
        {/* Header Fixo */}
        <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
          <button onClick={onBack} aria-label="Voltar" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-355 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center flex-1">
            <span className="font-black text-lg tracking-wide uppercase font-outfit text-white">REVELANDO</span>
          </div>
          <div className="text-xs font-black bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-emerald-400 font-outfit">
            {currentIndex + 1} de {players.length}
          </div>
        </div>

        {/* Área Central */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center gap-6 text-center animate-fade-in">
          {revealStep === 'hidden' ? (
            <>
              <div className="bg-slate-900 border border-white/5 p-5 rounded-full mb-2 shadow-xl">
                <UserSearch size={56} className="text-emerald-450" />
              </div>
              <h2 className="text-2xl font-black text-white font-outfit">Vez de {currentPlayer.name}</h2>
              <div className="bg-red-950/20 border-2 border-red-500/20 rounded-3xl p-6 shadow-xl max-w-xs w-full animate-fade-in-scale">
                <p className="text-red-400 font-black text-base mb-2 flex items-center justify-center gap-1.5 uppercase tracking-wider font-outfit">
                  <EyeOff size={20} /> Atenção!
                </p>
                <p className="text-red-200/80 text-xs sm:text-sm font-medium leading-relaxed">
                  <span className="font-black text-white text-base font-outfit block mb-1">{currentPlayer.name}</span>
                  Não olhe para a tela! Coloque o celular na testa e aguarde as pistas.
                </p>
              </div>
              <button
                onClick={handleReveal}
                className="w-full max-w-xs mt-6 py-4.5 bg-emerald-500 hover:bg-emerald-450 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 font-outfit"
              >
                <Eye size={22} /> Revelar Personagem
              </button>
            </>
          ) : (
            <>
              <div className="w-full max-w-xs bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden animate-fade-in-scale border border-emerald-400/20">
                <div className="absolute opacity-5 top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                   <UserSearch size={220} />
                </div>
                <p className="text-emerald-100/70 font-bold uppercase tracking-widest mb-3 relative z-10 text-[10px] font-outfit">
                  {currentPlayer.name} é:
                </p>
                <p className="text-3xl sm:text-4xl font-black relative z-10 drop-shadow-md leading-tight font-outfit select-none">
                  {currentPlayer.personality}
                </p>
              </div>
              
              <button
                onClick={handleNextReveal}
                className="w-full max-w-xs mt-6 py-4.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 border border-white/5 font-outfit"
              >
                Continuar <ArrowRight size={22} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER SCORING/PLAYING PHASE
  // ------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-slate-100 relative h-full overflow-hidden font-sans">
      {/* Header Fixo */}
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} aria-label="Voltar" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-emerald-400 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Dicas & Personagens</span>
      </div>

      <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/20 text-center shrink-0">
        <p className="text-emerald-300 text-xs sm:text-sm font-semibold font-sans px-2">
          {isMultiplayer 
            ? "Olhe para seus amigos! Você vê os personagens deles, mas o seu está oculto."
            : "Deem as dicas! Quem for adivinhando seu respectivo personagem ganha a pontuação."}
        </p>
      </div>

      {/* Cronômetro Premium */}
      <div className="mx-4 mt-4 flex items-center justify-between bg-slate-900/60 border border-white/5 px-5 py-3 rounded-2xl shadow-md backdrop-blur-md animate-fade-in shrink-0">
        <div className="flex items-center gap-1.5 opacity-60 text-[10px] text-emerald-300 font-black uppercase tracking-wider font-outfit">
          <span className={`w-2 h-2 rounded-full ${timerActive && timeLeft > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`} />
          Cronômetro
        </div>
        
        <div className={`text-2xl font-black font-outfit tracking-wider select-none ${timeLeft <= 10 && timeLeft > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setTimerActive(!timerActive); triggerVibration(50); }}
            className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all active:scale-90 text-[10px] font-bold font-outfit uppercase"
          >
            {timerActive && timeLeft > 0 ? "Pausar" : "Iniciar"}
          </button>
          <button 
            onClick={() => { setTimeLeft(prev => prev + 30); triggerVibration(50); }}
            className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all active:scale-90 text-[10px] font-bold font-outfit"
          >
            +30s
          </button>
        </div>
      </div>

      {/* Players List Rolável */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {playerData.map((p: PlayerData, index: number) => {
          const isMe = isMultiplayer && p.id === playerId;
          return (
            <div key={index} className="bg-slate-900/30 p-4 rounded-3xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-emerald-500/20 transition-all duration-200 relative overflow-hidden">
              <div className="flex-1">
                <span className="font-black text-xl text-white font-outfit block truncate max-w-[200px]">{p.name}</span>
                <p className="text-xs text-slate-455 mt-1 font-medium">
                  {isMe ? (
                    revealedMyOwn ? (
                      <span className="text-red-400 font-bold bg-red-950/20 px-2 py-0.5 rounded border border-red-500/10">Você é: <strong className="text-white text-sm">{p.personality}</strong></span>
                    ) : (
                      <span className="text-yellow-455 font-bold bg-yellow-950/10 px-2.5 py-1 rounded-lg border border-yellow-500/10 animate-pulse">❓ Oculto para você! Coloque na testa</span>
                    )
                  ) : (
                    <span>É: <strong className="text-emerald-300 font-black text-sm uppercase tracking-wide font-outfit">{p.personality}</strong></span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {isMe && !revealedMyOwn && (
                  <button
                    onClick={() => { setRevealedMyOwn(true); triggerVibration(100); }}
                    className="px-3.5 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 font-bold text-xs hover:bg-red-500/20 transition-all font-outfit uppercase tracking-wider"
                  >
                    Olhar
                  </button>
                )}
                
                <button
                  onClick={() => toggleGuess(index)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all text-xs font-black tracking-wider uppercase font-outfit border ${
                    p.guessedCorrectly 
                      ? 'bg-emerald-500 hover:bg-emerald-450 border-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-900/50 hover:bg-slate-900 border-white/5 text-slate-455'
                  }`}
                >
                  {p.guessedCorrectly ? <CheckCircle2 size={16} className="fill-emerald-300/20"/> : <Circle size={16} />}
                  <span>Acertou</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Fixo */}
      <div className="p-6 bg-slate-900 border-t border-white/5 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
        {(!isMultiplayer || isHost) ? (
          <button
            onClick={handleEndRound}
            className="w-full bg-white hover:bg-slate-200 text-slate-955 font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit"
          >
            <span>FINALIZAR RODADA</span> <ChevronLeft className="rotate-180" size={24} />
          </button>
        ) : (
          <div className="w-full bg-slate-955/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-450 animate-ping" />
            <span className="text-xs text-slate-450 font-black uppercase tracking-wider font-outfit">Líder finalizará rodada em breve...</span>
          </div>
        )}
      </div>
    </div>
  );
}
