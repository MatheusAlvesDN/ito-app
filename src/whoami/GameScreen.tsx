import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Trophy, 
  Home, 
  UserSearch, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  Plus, 
  Minus, 
  ChevronRight,
  Crown
} from 'lucide-react';
import { type WhoAmITheme, WHOAMI_THEMES } from './data';
import { syncService, triggerVibration } from '../utils/syncService';
import { audioService } from '../utils/audioService';
import { ReactionsOverlay, ReactionsTray } from '../components/ReactionsOverlay';

type Props = {
  onBack: () => void;
  players: string[];
  themes: WhoAmITheme[];
  isMultiplayer?: boolean;
  isHost?: boolean;
  syncGameState?: any;
  playerId?: string;
  connectedPlayers?: { id: string; name: string }[];
  isMuted: boolean;
  toggleMute: () => void;
};

type PlayerData = {
  id?: string;
  name: string;
  personality: string;
  guessedCorrectly: boolean;
  roundsToGuess?: number;
};

type MatchResult = {
  playerName: string;
  personality: string;
  guessedCorrectly: boolean;
  roundsToGuess: number;
};

type MatchRecord = {
  matchNumber: number;
  results: MatchResult[];
};

type PlayerOverall = {
  name: string;
  totalRounds: number;
  matchesGuessed: number;
  totalMatches: number;
  history: { matchNumber: number; rounds: number; guessed: boolean; personality: string }[];
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
  isMuted,
  toggleMute,
}: Props) {
  // --- LOCAL STATES ---
  const [localPlayerData, setLocalPlayerData] = useState<PlayerData[]>([]);
  const [localPhase, setLocalPhase] = useState<'reveal' | 'scoring' | 'ended' | 'overall_ended'>('reveal');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealStep, setRevealStep] = useState<'hidden' | 'showing'>('hidden');
  const [localCurrentRound, setLocalCurrentRound] = useState(1);
  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>({});
  const [localMatchNumber, setLocalMatchNumber] = useState(1);
  const [localMatchHistory, setLocalMatchHistory] = useState<MatchRecord[]>([]);

  // --- LOCAL PEAK/REVEAL OPTION FOR MULTIPLAYER ---
  const [revealedMyOwn, setRevealedMyOwn] = useState(false);

  // --- DERIVED MULTIPLAYER STATES ---
  const phase = isMultiplayer ? (syncGameState?.phase || 'playing') : localPhase;
  const playerData: PlayerData[] = isMultiplayer ? (syncGameState?.playerData || []) : localPlayerData;
  const currentRound: number = isMultiplayer ? (syncGameState?.currentRound || 1) : localCurrentRound;
  const matchNumber: number = isMultiplayer ? (syncGameState?.matchNumber || 1) : localMatchNumber;
  const matchHistory: MatchRecord[] = isMultiplayer ? (syncGameState?.matchHistory || []) : localMatchHistory;

  // --- TIMER STATE & EFFECTS ---
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (phase !== 'ended' && phase !== 'overall_ended') {
      setTimeLeft(120);
      setTimerActive(false);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'ended' || phase === 'overall_ended' || !timerActive || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          audioService.playFail();
          triggerVibration([200, 100, 200, 100, 400]); // Alarme vibratório!
          clearInterval(interval);
          return 0;
        }
        if (prev <= 10 && prev > 5) {
          audioService.playHeartbeat();
          triggerVibration(40);
        } else if (prev <= 5) {
          audioService.playTick();
          triggerVibration(60);
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
    if (t.personalities && Array.isArray(t.personalities) && t.personalities.length > 0) {
      return t.personalities;
    }
    if (t.id.startsWith('custom_theme_')) {
      try {
        const saved = localStorage.getItem('whoami_custom_personalities_' + t.id);
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const defaultTheme = WHOAMI_THEMES.find(item => item.id === t.id);
    return defaultTheme ? defaultTheme.personalities : [];
  };

  // Initialize game fresh
  const startGame = () => {
    // Gather personalities from chosen themes
    let allPersonalities = themes.flatMap(t => getThemePersonalities(t));
    allPersonalities = [...allPersonalities].sort(() => 0.5 - Math.random());
    
    let selected: string[] = [];
    while (selected.length < players.length && allPersonalities.length > 0) {
      selected = selected.concat(allPersonalities);
    }
    selected = selected.slice(0, players.length);
    
    const initialData: PlayerData[] = players.map((p, i) => ({
      name: p,
      personality: selected[i],
      guessedCorrectly: false,
      roundsToGuess: undefined,
    }));
    
    setLocalPlayerData(initialData);
    setLocalPhase('reveal');
    setCurrentIndex(0);
    setRevealStep('hidden');
    setLocalCurrentRound(1);
    setRevealedCards({});
    setLocalMatchNumber(1);
    setLocalMatchHistory([]);
  };

  const startMultiplayerGame = () => {
    if (!connectedPlayers || connectedPlayers.length < 2) return;

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
      roundsToGuess: undefined,
    }));

    setRevealedMyOwn(false);

    syncService.syncState({
      phase: 'playing',
      matchNumber: 1,
      matchHistory: [],
      currentRound: 1,
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
    audioService.playFlip();
    setRevealStep('showing');
    triggerVibration(100);
  };

  const handleNextReveal = () => {
    audioService.playFlip();
    if (currentIndex < players.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRevealStep('hidden');
    } else {
      setLocalPhase('scoring');
    }
  };

  const handleReroll = (index: number) => {
    audioService.playFlip();
    triggerVibration(80);

    const allPersonalities = themes.flatMap(t => getThemePersonalities(t));
    if (allPersonalities.length === 0) return;

    const currentTarget = playerData[index];
    const currentPers = currentTarget?.personality;

    // Filter out personalities currently used by other players
    const otherPersonalities = playerData
      .filter((_, i) => i !== index)
      .map(p => p.personality);

    const available = allPersonalities.filter(p => !otherPersonalities.includes(p) && p !== currentPers);
    const pool = available.length > 0 ? available : allPersonalities.filter(p => p !== currentPers);
    const newPersonality = pool.length > 0 
      ? pool[Math.floor(Math.random() * pool.length)] 
      : allPersonalities[Math.floor(Math.random() * allPersonalities.length)];

    if (isMultiplayer) {
      const copy = [...playerData];
      copy[index] = { ...copy[index], personality: newPersonality };
      syncService.syncState({ playerData: copy });
    } else {
      setRevealedCards(prev => ({ ...prev, [index]: false }));
      setLocalPlayerData(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], personality: newPersonality };
        return copy;
      });
    }
  };

  const toggleRevealCard = (index: number) => {
    audioService.playFlip();
    triggerVibration(50);
    setRevealedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleNextRound = () => {
    audioService.playPop();
    triggerVibration(60);
    const nextRound = currentRound + 1;
    if (isMultiplayer) {
      syncService.syncState({ currentRound: nextRound });
    } else {
      setLocalCurrentRound(nextRound);
    }
  };

  const handleAdjustRounds = (index: number, delta: number) => {
    audioService.playTick();
    triggerVibration(40);
    const currentVal = playerData[index]?.roundsToGuess ?? currentRound;
    const newVal = Math.max(1, currentVal + delta);

    if (isMultiplayer) {
      const copy = [...playerData];
      copy[index] = { ...copy[index], roundsToGuess: newVal };
      syncService.syncState({ playerData: copy });
    } else {
      setLocalPlayerData(prev => {
        const copy = [...prev];
        copy[index] = { ...copy[index], roundsToGuess: newVal };
        return copy;
      });
    }
  };

  const toggleGuess = (index: number) => {
    audioService.playTick();
    triggerVibration(60);
    if (isMultiplayer) {
      const copy = [...playerData];
      const willBeCorrect = !copy[index].guessedCorrectly;
      copy[index] = {
        ...copy[index],
        guessedCorrectly: willBeCorrect,
        roundsToGuess: willBeCorrect ? (copy[index].roundsToGuess || currentRound) : undefined,
      };
      syncService.syncState({ playerData: copy });
    } else {
      setLocalPlayerData((prev) => {
        const copy = [...prev];
        const willBeCorrect = !copy[index].guessedCorrectly;
        copy[index] = {
          ...copy[index],
          guessedCorrectly: willBeCorrect,
          roundsToGuess: willBeCorrect ? (copy[index].roundsToGuess || currentRound) : undefined,
        };
        return copy;
      });
    }
  };

  // Encerra a partida atual e arquiva no histórico
  const handleEndRound = () => {
    audioService.playSuccess();
    triggerVibration([100, 50, 100]);

    const currentResults: MatchResult[] = playerData.map(p => ({
      playerName: p.name,
      personality: p.personality,
      guessedCorrectly: p.guessedCorrectly,
      roundsToGuess: p.guessedCorrectly ? (p.roundsToGuess ?? currentRound) : currentRound,
    }));

    const existingIdx = matchHistory.findIndex(m => m.matchNumber === matchNumber);
    let updatedHistory: MatchRecord[];
    if (existingIdx >= 0) {
      updatedHistory = [...matchHistory];
      updatedHistory[existingIdx] = { matchNumber, results: currentResults };
    } else {
      updatedHistory = [...matchHistory, { matchNumber, results: currentResults }];
    }

    if (isMultiplayer) {
      syncService.syncState({
        phase: 'ended',
        matchHistory: updatedHistory
      });
    } else {
      setLocalMatchHistory(updatedHistory);
      setLocalPhase('ended');
    }
  };

  // Jogar próxima partida acumulando
  const handleNextMatch = () => {
    audioService.playPop();
    triggerVibration(60);

    const nextMatchNum = matchNumber + 1;
    let allPersonalities = themes.flatMap(t => getThemePersonalities(t));
    allPersonalities = [...allPersonalities].sort(() => 0.5 - Math.random());

    const activeList = isMultiplayer ? connectedPlayers : players;
    let selected: string[] = [];
    while (selected.length < activeList.length && allPersonalities.length > 0) {
      selected = selected.concat(allPersonalities);
    }
    selected = selected.slice(0, activeList.length);

    if (isMultiplayer) {
      const nextPlayerData: PlayerData[] = connectedPlayers.map((player, i) => ({
        id: player.id,
        name: player.name,
        personality: selected[i],
        guessedCorrectly: false,
        roundsToGuess: undefined,
      }));

      setRevealedMyOwn(false);

      syncService.syncState({
        phase: 'playing',
        matchNumber: nextMatchNum,
        currentRound: 1,
        playerData: nextPlayerData,
        matchHistory: matchHistory,
        roundKey: Date.now()
      });
    } else {
      const nextPlayerData: PlayerData[] = players.map((p, i) => ({
        name: p,
        personality: selected[i],
        guessedCorrectly: false,
        roundsToGuess: undefined,
      }));

      setLocalMatchNumber(nextMatchNum);
      setLocalPlayerData(nextPlayerData);
      setLocalCurrentRound(1);
      setLocalPhase('reveal');
      setCurrentIndex(0);
      setRevealStep('hidden');
      setRevealedCards({});
    }
  };

  // Ver o placar geral final
  const handleShowOverallLeaderboard = () => {
    audioService.playPop();
    triggerVibration(60);
    if (isMultiplayer) {
      syncService.syncState({ phase: 'overall_ended' });
    } else {
      setLocalPhase('overall_ended');
    }
  };

  // Reiniciar todo o torneio do zero
  const handleResetAll = () => {
    audioService.playPop();
    triggerVibration(60);
    if (isMultiplayer) {
      syncService.syncState({
        phase: 'setup',
        matchNumber: 1,
        matchHistory: [],
        currentRound: 1,
        roundKey: Date.now()
      });
    } else {
      setLocalMatchNumber(1);
      setLocalMatchHistory([]);
      startGame();
    }
  };

  // Calcular estatísticas acumuladas do torneio
  const getOverallStats = (): PlayerOverall[] => {
    const allNames = Array.from(new Set([
      ...players,
      ...playerData.map(p => p.name),
      ...matchHistory.flatMap(m => m.results.map(r => r.playerName))
    ]));

    const statsMap: Record<string, PlayerOverall> = {};
    allNames.forEach(name => {
      statsMap[name] = {
        name,
        totalRounds: 0,
        matchesGuessed: 0,
        totalMatches: matchHistory.length,
        history: []
      };
    });

    matchHistory.forEach(match => {
      match.results.forEach(res => {
        if (!statsMap[res.playerName]) {
          statsMap[res.playerName] = {
            name: res.playerName,
            totalRounds: 0,
            matchesGuessed: 0,
            totalMatches: matchHistory.length,
            history: []
          };
        }
        const pStat = statsMap[res.playerName];
        pStat.totalRounds += res.roundsToGuess;
        if (res.guessedCorrectly) {
          pStat.matchesGuessed += 1;
        }
        pStat.history.push({
          matchNumber: match.matchNumber,
          rounds: res.roundsToGuess,
          guessed: res.guessedCorrectly,
          personality: res.personality
        });
      });
    });

    // Ordenação: 1º quem mais acertou partidas, 2º quem teve menos rodadas totais somadas
    return Object.values(statsMap).sort((a, b) => {
      if (a.matchesGuessed !== b.matchesGuessed) {
        return b.matchesGuessed - a.matchesGuessed;
      }
      return a.totalRounds - b.totalRounds;
    });
  };

  // ------------------------------------------------------------------
  // RENDER OVERALL ENDED (Placar Geral Final com Campeão)
  // ------------------------------------------------------------------
  if (phase === 'overall_ended') {
    const overallStats = getOverallStats();
    const champion = overallStats[0];

    return (
      <div className="flex-1 flex flex-col bg-slate-955 text-white h-full relative overflow-hidden font-sans">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Área Central Rolável */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center animate-fade-in z-10 overflow-y-auto">
          <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/10 border border-amber-400/30 p-5 rounded-full mb-3 shadow-2xl relative">
            <Crown size={52} className="text-yellow-400 drop-shadow-lg" />
          </div>
          <h2 className="text-3xl font-black mb-1 text-center font-outfit">Placar Geral Final</h2>
          <p className="text-slate-400 mb-4 text-center text-sm font-medium">
            Total de <span className="font-bold text-white">{matchHistory.length}</span> {matchHistory.length === 1 ? 'partida disputada' : 'partidas disputadas'}
          </p>

          {/* Destaque do Campeão */}
          {champion && (
            <div className="w-full max-w-md bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-400/40 rounded-3xl p-4 mb-4 text-center shadow-lg shadow-amber-500/10 animate-fade-in-scale">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 font-outfit block mb-1">
                👑 Grande Campeão
              </span>
              <p className="text-2xl font-black font-outfit text-white drop-shadow-sm">
                {champion.name}
              </p>
              <div className="flex items-center justify-center gap-3 mt-2 text-xs font-bold text-amber-200/90 font-outfit">
                <span>{champion.totalRounds} rodadas totais</span>
                <span>•</span>
                <span>{champion.matchesGuessed} de {champion.totalMatches} acertos</span>
              </div>
            </div>
          )}

          {/* Lista de Classificação Geral */}
          <div className="w-full max-w-md space-y-3 mb-6 overflow-y-auto max-h-[40vh] pr-1">
            {overallStats.map((p, i) => {
              const rank = i + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-2xl flex flex-col gap-2 border-2 transition-all duration-200 ${
                    isFirst 
                      ? 'bg-amber-950/30 border-amber-400/50 shadow-md shadow-amber-500/10' 
                      : isSecond
                      ? 'bg-slate-800/50 border-slate-300/40 shadow-sm'
                      : isThird
                      ? 'bg-amber-950/20 border-amber-600/30 shadow-sm'
                      : 'bg-slate-900/40 border-white/5 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm font-outfit shrink-0 shadow-md ${
                        isFirst 
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 ring-2 ring-amber-300/40' 
                          : isSecond
                          ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 ring-2 ring-slate-300/30'
                          : isThird
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white ring-2 ring-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-white/10'
                      }`}>
                        {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `${rank}º`}
                      </div>

                      <div>
                        <p className="font-bold text-lg font-outfit text-white leading-snug">{p.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {p.matchesGuessed} de {p.totalMatches} {p.totalMatches === 1 ? 'partida acertada' : 'partidas acertadas'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`font-black text-sm px-3 py-1 rounded-full font-outfit uppercase tracking-wider inline-block ${
                        isFirst
                          ? 'text-amber-300 bg-amber-500/20 border border-amber-400/30'
                          : 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                      }`}>
                        {p.totalRounds} {p.totalRounds === 1 ? 'rodada' : 'rodadas'}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        Média: {(p.totalRounds / (p.totalMatches || 1)).toFixed(1)} / partida
                      </span>
                    </div>
                  </div>

                  {/* Chips de histórico das partidas */}
                  {p.history.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-outfit mr-1">Partidas:</span>
                      {p.history.map((h, hIdx) => (
                        <span 
                          key={hIdx}
                          title={`Partida ${h.matchNumber}: ${h.personality} (${h.guessed ? 'Acertou em ' + h.rounds + ' rodadas' : 'Não acertou'})`}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border font-outfit ${
                            h.guessed 
                              ? 'bg-white/5 text-emerald-300 border-emerald-500/20' 
                              : 'bg-red-500/10 text-red-300 border-red-500/20'
                          }`}
                        >
                          P{h.matchNumber}: {h.rounds}r
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5 w-full max-w-md mt-auto pt-2 shrink-0">
            {(!isMultiplayer || isHost) ? (
              <button
                onClick={handleResetAll}
                className="w-full bg-emerald-500 hover:bg-emerald-450 text-white font-black text-base py-3.5 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit"
              >
                <RotateCcw size={18} /> Iniciar Novo Torneio
              </button>
            ) : (
              <div className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">Aguardando líder reiniciar torneio...</span>
              </div>
            )}
            <button
              onClick={onBack}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-350 font-bold text-sm py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/5 font-outfit"
            >
              <Home size={16} /> Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER ENDED (Resultado da partida atual com navegação para próxima ou placar geral)
  // ------------------------------------------------------------------
  if (phase === 'ended') {
    // Sort: players who guessed correctly first (by lowest roundsToGuess), then players who missed
    const sortedPlayers = [...playerData].sort((a, b) => {
      if (a.guessedCorrectly && !b.guessedCorrectly) return -1;
      if (!a.guessedCorrectly && b.guessedCorrectly) return 1;
      if (a.guessedCorrectly && b.guessedCorrectly) {
        return (a.roundsToGuess ?? 1) - (b.roundsToGuess ?? 1);
      }
      return 0;
    });

    return (
      <div className="flex-1 flex flex-col bg-slate-955 text-white h-full relative overflow-hidden font-sans">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Área Central Rolável */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center animate-fade-in z-10 overflow-y-auto">
          <div className="bg-slate-900 border border-white/5 p-6 rounded-full mb-3 shadow-xl">
            <Trophy size={60} className="text-yellow-450 drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-black mb-1 text-center font-outfit">Fim da Partida {matchNumber}!</h2>
          <p className="text-slate-400 mb-4 text-center text-sm font-medium">Veja quem adivinhou em menos rodadas nesta partida:</p>

          {/* Mini banner Placar Geral */}
          {matchHistory.length > 0 && (
            <div className="w-full max-w-md bg-slate-900/60 border border-white/5 px-4 py-2.5 rounded-2xl mb-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-bold font-outfit">
                <Trophy size={15} className="text-yellow-400" />
                <span>Placar Geral: <strong className="text-white">{matchHistory.length}</strong> {matchHistory.length === 1 ? 'partida disputada' : 'partidas disputadas'}</span>
              </div>
              <button
                onClick={handleShowOverallLeaderboard}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold font-outfit underline cursor-pointer"
              >
                Ver Placar Geral
              </button>
            </div>
          )}

          <div className="w-full max-w-md space-y-3 mb-6 overflow-y-auto max-h-[38vh] pr-1">
            {sortedPlayers.map((p: PlayerData, i: number) => {
              const rank = i + 1;
              const isFirst = p.guessedCorrectly && rank === 1;
              const isSecond = p.guessedCorrectly && rank === 2;
              const isThird = p.guessedCorrectly && rank === 3;

              return (
                <div 
                  key={i} 
                  className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all duration-200 ${
                    p.guessedCorrectly 
                      ? isFirst 
                        ? 'bg-amber-950/30 border-amber-400/50 shadow-lg shadow-amber-500/10' 
                        : isSecond
                        ? 'bg-slate-800/50 border-slate-300/40 shadow-sm'
                        : isThird
                        ? 'bg-amber-950/20 border-amber-600/30 shadow-sm'
                        : 'bg-emerald-950/20 border-emerald-500/40 shadow-sm' 
                      : 'bg-red-950/10 border-red-500/20 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    {p.guessedCorrectly ? (
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm font-outfit shrink-0 shadow-md ${
                        isFirst 
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 ring-2 ring-amber-300/40' 
                          : isSecond
                          ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950 ring-2 ring-slate-300/30'
                          : isThird
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white ring-2 ring-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isFirst ? '🥇' : isSecond ? '🥈' : isThird ? '🥉' : `${rank}º`}
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs font-outfit shrink-0 bg-red-500/10 text-red-400 border border-red-500/20">
                        ✕
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-lg font-outfit text-white leading-snug">{p.name}</p>
                      <p className="text-xs text-slate-455 mt-0.5 font-medium">Era: <span className="font-bold text-slate-200">{p.personality}</span></p>
                    </div>
                  </div>

                  {p.guessedCorrectly ? (
                    <div className="text-right shrink-0">
                      <div className={`flex items-center gap-1 font-black text-xs px-3 py-1 rounded-full font-outfit uppercase tracking-wider ${
                        isFirst
                          ? 'text-amber-300 bg-amber-500/20 border border-amber-400/30'
                          : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      }`}>
                        <CheckCircle2 size={13} className={isFirst ? "fill-amber-400/30 text-amber-300" : "fill-emerald-400/20"} />
                        <span>{p.roundsToGuess ?? 1}ª Rodada</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        {p.roundsToGuess === 1 ? '1 rodada necessária' : `${p.roundsToGuess ?? 1} rodadas`}
                      </span>
                    </div>
                  ) : (
                    <div className="text-red-400 font-bold text-xs bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full font-outfit uppercase tracking-wider shrink-0">
                      Não acertou
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5 w-full max-w-md mt-auto pt-2 shrink-0">
            {(!isMultiplayer || isHost) ? (
              <>
                <button
                  onClick={handleNextMatch}
                  className="w-full bg-emerald-500 hover:bg-emerald-450 text-white font-black text-base py-3.5 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit"
                >
                  <RotateCcw size={18} /> Jogar Próxima Partida
                </button>
                <button
                  onClick={handleShowOverallLeaderboard}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 font-black text-base py-3.5 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit"
                >
                  <Trophy size={18} className="text-amber-400" /> Encerrar Jogo & Ver Placar Geral
                </button>
              </>
            ) : (
              <div className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">Aguardando líder avançar partida...</span>
              </div>
            )}
            <button
              onClick={onBack}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-350 font-bold text-sm py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/5 font-outfit"
            >
              <Home size={16} /> Voltar ao Início
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
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-355 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={toggleMute}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-355 transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
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
              
              <div className="w-full max-w-xs flex flex-col gap-2.5 mt-2">
                <button
                  onClick={() => handleReroll(currentIndex)}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 text-emerald-300 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 border border-emerald-500/20 font-outfit"
                >
                  <RefreshCw size={16} /> Trocar Personagem (Reroll)
                </button>
                <button
                  onClick={handleNextReveal}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 border border-white/5 font-outfit"
                >
                  Continuar <ArrowRight size={22} />
                </button>
              </div>
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
      <ReactionsOverlay />
      {/* Header Fixo */}
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-emerald-400 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={toggleMute}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-355 transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
        <span className="font-black text-xl text-white font-outfit">Dicas & Personagens</span>
      </div>

      <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20 text-center shrink-0 flex items-center justify-between px-4">
        <span className="text-[11px] font-black uppercase tracking-wider font-outfit text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded-full shrink-0">
          Partida {matchNumber}
        </span>
        <p className="text-emerald-300 text-xs sm:text-sm font-semibold font-sans px-2">
          {isMultiplayer 
            ? "Olhe para seus amigos! Você vê os personagens deles, mas o seu está oculto."
            : "Deem as dicas! Toque em 'Revelar' para conferir os personagens."}
        </p>
        <span className="w-16 shrink-0 hidden sm:block" />
      </div>

      {/* Painel de Controle: Rodadas & Cronômetro */}
      <div className="mx-4 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0 animate-fade-in">
        {/* Bloco Contador de Rodadas */}
        <div className="bg-slate-900/60 border border-white/5 px-4 py-3 rounded-2xl shadow-md backdrop-blur-md flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 opacity-60 text-[10px] text-emerald-300 font-black uppercase tracking-wider font-outfit">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Partida {matchNumber} • Rodada
            </div>
            <div className="text-xl font-black font-outfit text-white tracking-wide mt-0.5">
              Rodada {currentRound}
            </div>
          </div>

          {(!isMultiplayer || isHost) && (
            <button
              onClick={handleNextRound}
              className="py-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl transition-all active:scale-95 text-xs font-bold font-outfit flex items-center gap-1 shadow-sm"
            >
              <span>+ Próxima</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Bloco Cronômetro */}
        <div className="bg-slate-900/60 border border-white/5 px-4 py-3 rounded-2xl shadow-md backdrop-blur-md flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 opacity-60 text-[10px] text-emerald-300 font-black uppercase tracking-wider font-outfit">
              <span className={`w-2 h-2 rounded-full ${timerActive && timeLeft > 0 ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'}`} />
              Cronômetro
            </div>
            <div className={`text-xl font-black font-outfit tracking-wider select-none mt-0.5 ${timeLeft <= 10 && timeLeft > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => { setTimerActive(!timerActive); triggerVibration(50); }}
              className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all active:scale-90 text-[11px] font-bold font-outfit uppercase"
            >
              {timerActive && timeLeft > 0 ? "Pausar" : "Iniciar"}
            </button>
            <button 
              onClick={() => { setTimeLeft(prev => prev + 30); triggerVibration(50); }}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all active:scale-90 text-[11px] font-bold font-outfit"
            >
              +30s
            </button>
          </div>
        </div>
      </div>

      {/* Players List Rolável */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {playerData.map((p: PlayerData, index: number) => {
          const isMe = isMultiplayer && p.id === playerId;
          const isRevealedLocally = Boolean(revealedCards[index]) || p.guessedCorrectly;

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
                    (!isMultiplayer && !isRevealedLocally) ? (
                      <span 
                        onClick={() => toggleRevealCard(index)}
                        className="text-yellow-455 font-bold bg-yellow-950/20 px-2.5 py-1 rounded-lg border border-yellow-500/15 cursor-pointer hover:bg-yellow-950/30 transition-colors inline-flex items-center gap-1.5 select-none"
                        title="Toque para ver o personagem"
                      >
                        ❓ <span>Oculto (toque para ver)</span>
                      </span>
                    ) : (
                      <span>É: <strong className="text-emerald-300 font-black text-sm uppercase tracking-wide font-outfit">{p.personality}</strong></span>
                    )
                  )}
                </p>

                {/* Indicação da rodada em que acertou + ajuste fino */}
                {p.guessedCorrectly && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400 font-outfit font-bold">
                    <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                      Acertou na {p.roundsToGuess ?? 1}ª rodada
                    </span>
                    {(!isMultiplayer || isHost) && (
                      <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-white/5">
                        <button
                          onClick={() => handleAdjustRounds(index, -1)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 text-xs font-bold transition-colors"
                          title="Diminuir rodada"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs px-1 text-slate-200 font-black min-w-[16px] text-center">{p.roundsToGuess ?? 1}</span>
                        <button
                          onClick={() => handleAdjustRounds(index, 1)}
                          className="w-5 h-5 flex items-center justify-center hover:bg-slate-700 rounded text-slate-300 text-xs font-bold transition-colors"
                          title="Aumentar rodada"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                {/* Botão de Revelar / Ocultar (modo local) */}
                {!isMultiplayer && !p.guessedCorrectly && (
                  <button
                    onClick={() => toggleRevealCard(index)}
                    title={revealedCards[index] ? "Ocultar personagem" : "Revelar personagem"}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-bold font-outfit transition-all active:scale-95 ${
                      revealedCards[index]
                        ? 'bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                  >
                    {revealedCards[index] ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{revealedCards[index] ? "Ocultar" : "Revelar"}</span>
                  </button>
                )}

                {isMe && !revealedMyOwn && (
                  <button
                    onClick={() => { audioService.playFlip(); setRevealedMyOwn(true); triggerVibration(100); }}
                    className="px-3.5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 font-bold text-xs hover:bg-red-500/20 transition-all font-outfit uppercase tracking-wider"
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
      {isMultiplayer && (
        <div className="absolute bottom-28 left-0 right-0 flex justify-center z-45 pointer-events-none">
          <ReactionsTray />
        </div>
      )}
    </div>
  );
}
