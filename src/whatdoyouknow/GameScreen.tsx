import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  HelpCircle,
  RefreshCw,
  MessageCircle,
  CheckCircle,
  Trophy,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { type WhatDoYouKnowTheme } from './data';
import { syncService, triggerVibration } from '../utils/syncService';
import { audioService } from '../utils/audioService';
import { ReactionsOverlay, ReactionsTray } from '../components/ReactionsOverlay';

type GameStep = 'question' | 'scoring' | 'leaderboard';

type Props = {
  onBack: () => void;
  players: string[];
  themes: WhatDoYouKnowTheme[];
  isMultiplayer?: boolean;
  isHost?: boolean;
  syncGameState?: any;
  playerId?: string;
  connectedPlayers?: { id: string; name: string }[];
  isMuted: boolean;
  toggleMute: () => void;
};

export default function GameScreenWhatDoYouKnow({
  onBack,
  players,
  themes,
  isMultiplayer = false,
  isHost = false,
  syncGameState = null,
  playerId = '',
  connectedPlayers = [],
  isMuted,
  toggleMute,
}: Props) {
  // --- ESTADOS LOCAIS ---
  const [localStep, setLocalStep] = useState<GameStep>('question');
  const [roundKey, setRoundKey] = useState(0);

  const [localTargetPlayer, setLocalTargetPlayer] = useState<string>('');
  const [localQuestion, setLocalQuestion] = useState<string>('');
  const [localScores, setLocalScores] = useState<Record<string, number>>({});
  const [localRemainingTargets, setLocalRemainingTargets] = useState<string[]>([]);

  // Para a tela de pontuação
  const [selectedWinners, setSelectedWinners] = useState<Set<string>>(new Set());

  // --- ESTADOS DERIVADOS MULTIPLAYER ---
  const step = isMultiplayer ? (syncGameState?.step || 'question') : localStep;
  const targetPlayer = isMultiplayer ? (syncGameState?.targetPlayer || '') : localTargetPlayer;
  const question = isMultiplayer ? (syncGameState?.question || '') : localQuestion;
  const scores = isMultiplayer ? (syncGameState?.scores || {}) : localScores;
  
  // Lista de jogadores (nomes)
  const activePlayers = isMultiplayer ? connectedPlayers.map(p => p.name) : players;

  // --- LÓGICA DE INICIALIZAÇÃO ---

  const getAllQuestions = () => {
    let pool: string[] = [];
    themes.forEach((t) => {
      if (t.questions && Array.isArray(t.questions)) {
        pool = [...pool, ...t.questions];
      }
    });
    return pool;
  };

  const getNextTarget = (currentRemaining: string[], allPlayers: string[]) => {
    let pool = [...currentRemaining];
    if (pool.length === 0) {
      pool = [...allPlayers]; // Refill
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    pool.splice(randomIndex, 1);
    return { selected, newRemaining: pool };
  };

  const setupRound = () => {
    if (activePlayers.length < 3) return;

    let remaining = [...localRemainingTargets];
    // Se for o primeiro round, inicializa
    if (Object.keys(localScores).length === 0) {
      const initScores: Record<string, number> = {};
      activePlayers.forEach(p => initScores[p] = 0);
      setLocalScores(initScores);
      remaining = [...activePlayers];
    }

    const { selected, newRemaining } = getNextTarget(remaining, activePlayers);
    setLocalRemainingTargets(newRemaining);
    setLocalTargetPlayer(selected);

    const questions = getAllQuestions();
    const randomQ = questions.length > 0 
      ? questions[Math.floor(Math.random() * questions.length)]
      : 'Qual é a minha cor favorita? (Sem perguntas cadastradas)';

    setLocalQuestion(randomQ);
    setLocalStep('question');
    setSelectedWinners(new Set());
  };

  const setupMultiplayerRound = () => {
    if (!connectedPlayers || connectedPlayers.length < 3) return;

    const currentScores = syncGameState?.scores || {};
    let remaining = syncGameState?.remainingTargets || [];

    // Inicializa scores se vazio
    if (Object.keys(currentScores).length === 0) {
      connectedPlayers.forEach(p => currentScores[p.name] = 0);
      remaining = connectedPlayers.map(p => p.name);
    }

    const { selected, newRemaining } = getNextTarget(remaining, connectedPlayers.map(p => p.name));

    const questions = getAllQuestions();
    const randomQ = questions.length > 0 
      ? questions[Math.floor(Math.random() * questions.length)]
      : 'Qual é a minha cor favorita? (Sem perguntas cadastradas)';

    syncService.syncState({
      phase: 'game',
      step: 'question',
      targetPlayer: selected,
      question: randomQ,
      scores: currentScores,
      remainingTargets: newRemaining
    });
  };

  useEffect(() => {
    if (!isMultiplayer) {
      setupRound();
    }
  }, [roundKey]);

  useEffect(() => {
    if (isMultiplayer && isHost && syncGameState?.phase === 'setup') {
      setupMultiplayerRound();
    }
  }, [isHost, isMultiplayer, syncGameState?.phase, syncGameState?.roundKey]);

  // --- HANDLERS ---

  const handleGoToScoring = () => {
    triggerVibration(50);
    if (isMultiplayer) {
      syncService.syncState({ step: 'scoring' });
    } else {
      setLocalStep('scoring');
    }
  };

  const handleConfirmScores = () => {
    audioService.playSuccess();
    triggerVibration([50, 100, 50]);

    const newScores = { ...scores };
    const correctCount = selectedWinners.size;

    // A pessoa que respondeu ganha 1 ponto por CADA pessoa que acertou
    if (newScores[targetPlayer] !== undefined) {
      newScores[targetPlayer] += correctCount;
    }

    // Cada pessoa que acertou ganha 1 ponto
    selectedWinners.forEach(winner => {
      if (newScores[winner] !== undefined) {
        newScores[winner] += 1;
      }
    });

    if (isMultiplayer) {
      syncService.syncState({
        step: 'leaderboard',
        scores: newScores
      });
    } else {
      setLocalScores(newScores);
      setLocalStep('leaderboard');
    }
  };

  const handleNextRound = () => {
    triggerVibration(50);
    if (isMultiplayer) {
      setupMultiplayerRound();
    } else {
      setRoundKey(k => k + 1);
    }
  };

  const toggleWinner = (playerName: string) => {
    triggerVibration(50);
    const newSet = new Set(selectedWinners);
    if (newSet.has(playerName)) {
      newSet.delete(playerName);
    } else {
      newSet.add(playerName);
    }
    setSelectedWinners(newSet);
  };

  // --- RENDER ---
  
  if (activePlayers.length < 3) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-center text-slate-100 font-sans h-full">
        <h2 className="text-2xl font-black text-white mb-2 font-outfit">Jogadores Insuficientes</h2>
        <p className="text-slate-400 mb-6 text-sm font-medium">O modo O Que Você Sabe precisa de no mínimo 3 pessoas.</p>
        <button onClick={onBack} className="bg-slate-900 border border-white/5 text-white px-6 py-3 rounded-2xl font-bold font-outfit active:scale-95 transition-all">Voltar</button>
      </div>
    );
  }

  // FASE 1: PERGUNTA
  if (step === 'question') {
    const isMyTurn = isMultiplayer ? (connectedPlayers.find(p => p.id === playerId)?.name === targetPlayer) : false;

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
          <span className="text-rose-455 text-[10px] font-black uppercase tracking-widest font-outfit">O Que Você Sabe?</span>
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

  // FASE 2: AVALIAÇÃO (SCORING)
  if (step === 'scoring') {
    const guessingPlayers = activePlayers.filter(p => p !== targetPlayer);

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
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isWinner
                        ? 'bg-rose-500/10 border-rose-500'
                        : 'bg-slate-900/40 border-white/5 hover:border-rose-500/30'
                    }`}
                  >
                    <span className={`font-bold text-lg font-outfit ${isWinner ? 'text-rose-400' : 'text-slate-200'}`}>
                      {player}
                    </span>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border-2 ${
                      isWinner ? 'bg-rose-500 border-rose-500 text-white scale-110' : 'border-slate-600 text-transparent'
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

  // FASE 3: LEADERBOARD
  if (step === 'leaderboard') {
    const sortedPlayers = [...activePlayers].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));

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
              const isFirst = index === 0 && scores[player] > 0;
              return (
                <div
                  key={player}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${
                    isFirst
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/50'
                      : 'bg-slate-900/40 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-black text-xl font-outfit ${isFirst ? 'text-amber-400' : 'text-slate-500'}`}>
                      {index + 1}
                    </span>
                    <span className={`font-bold text-lg font-outfit ${isFirst ? 'text-white' : 'text-slate-200'}`}>
                      {player}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-955 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="font-black text-rose-400 font-outfit">{scores[player] || 0}</span>
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

  return null;
}
