import { useState, useEffect } from 'react';
import { ChevronLeft, Dices, Check, Unlock, Star, Cloud, RefreshCw, Lock, GripVertical, Heart, Volume2, VolumeX, Home, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { QUESTIONS_DB } from './data';
import type { Theme } from '../data';
import type { DragEndEvent } from '@dnd-kit/core';
import { syncService, triggerVibration } from '../utils/syncService';
import { audioService } from '../utils/audioService';
import { ReactionsOverlay, ReactionsTray } from '../components/ReactionsOverlay';

// Importações do DND Kit para Drag and Drop
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Componente de Confetti (Mantido igual) ---
const Confetti = () => {
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#FACC15', '#4ADE80', '#60A5FA', '#F472B6'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-5%',
            backgroundColor: p.color,
            animationDuration: `${2 + Math.random() * 3}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// --- Novo Componente: Item da Lista Arrastável ---
interface SortableItemProps {
  id: string;
  player: string;
  number: number;
  index: number;
  phase: string;
  isWrong: boolean;
  disabled?: boolean;
}

const SortablePlayerItem = ({ id, player, number, index, phase, isWrong, disabled = false }: SortableItemProps) => {
  // Hook do DND Kit para tornar o item arrastável
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id, disabled: phase === 'result' || disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto', // Traz o item para frente enquanto arrasta
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as 'relative',
    touchAction: 'none' // Importante para evitar scroll enquanto arrasta no mobile
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center p-3 rounded-xl border-2 transition-colors duration-300 mb-3 
        ${phase === 'result' 
          ? (isWrong ? 'bg-red-900/40 border-red-500/50' : 'bg-slate-800 border-green-500/30') 
          : (isDragging ? 'bg-slate-700 border-yellow-400 shadow-xl' : 'bg-slate-800 border-slate-700 shadow-md')
        }`}
    >
      <div className="flex flex-col gap-1 mr-3 items-center">
        {phase === 'ordering' && (
          // O ícone de Grip recebe os listeners, tornando-o a "alça" de arrastar
          // Se quiser arrastar pelo card inteiro, mova {...listeners} para a div pai
          <div {...listeners} className="p-2 text-slate-500 hover:text-white cursor-grab active:cursor-grabbing touch-none">
            <GripVertical size={24} />
          </div>
        )}
        {phase === 'result' && <div className="w-8 flex justify-center text-slate-600 font-bold">#{index + 1}</div>}
      </div>
      
      <div className="flex-1 font-bold text-white text-lg select-none">{player}</div>
      
      {phase === 'result' ? (
        <div className={`px-4 py-2 rounded-lg font-black text-xl min-w-[60px] text-center transform transition-all ${isWrong ? 'bg-red-500 text-white scale-110 shadow-red-500/50 shadow-lg' : 'bg-green-500 text-white'}`}>
          {number}
        </div>
      ) : (
        <div className="w-12 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xl select-none">?</div>
      )}
    </div>
  );
};

type Props = {
  onBack: () => void;
  players: string[];
  themes: Theme[];
  isMultiplayer?: boolean;
  isHost?: boolean;
  syncGameState?: any;
  playerId?: string;
  connectedPlayers?: { id: string; name: string }[];
  isMuted: boolean;
  toggleMute: () => void;
  saboteurMode?: boolean;
};

// --- Componente Principal ---
const GameScreen = ({
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
  saboteurMode = false,
}: Props) => {
  const [localPhase, setLocalPhase] = useState<'init' | 'rolling' | 'numbers' | 'ordering' | 'result' | 'saboteur-voting' | 'saboteur-reveal'>('init');
  const [localPlayerNumbers, setLocalPlayerNumbers] = useState<Record<string, number>>({});
  const [localCurrentQuestion, setLocalCurrentQuestion] = useState<string>('');
  const [localCurrentThemeColor, setLocalCurrentThemeColor] = useState<string>('');
  const [localRound, setLocalRound] = useState(1);
  const [localOrderedPlayers, setLocalOrderedPlayers] = useState<string[]>([]);
  const [localIsVictory, setLocalIsVictory] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [localLives, setLocalLives] = useState(3);

  // Estados específicos para o modo Sabotador
  const [localSaboteurName, setLocalSaboteurName] = useState<string>('');
  const [localSuspect, setLocalSuspect] = useState<string>('');
  
  // --- LOCAL MULTIPLAYER STATE ---
  const [revealedMyOwn, setRevealedMyOwn] = useState(false);

  // --- ESTADOS DERIVADOS MULTIPLAYER ---
  const phase = isMultiplayer ? (syncGameState?.phase || 'init') : localPhase;
  const playerNumbers = isMultiplayer ? (syncGameState?.playerNumbers || {}) : localPlayerNumbers;
  const currentQuestion = isMultiplayer ? (syncGameState?.currentQuestion || '') : localCurrentQuestion;
  const currentThemeColor = isMultiplayer ? (syncGameState?.currentThemeColor || '') : localCurrentThemeColor;
  const round = isMultiplayer ? (syncGameState?.round || 1) : localRound;
  const orderedPlayers = (isMultiplayer ? (syncGameState?.orderedPlayers || []) : localOrderedPlayers) as string[];
  const isVictory = isMultiplayer ? (syncGameState?.isVictory || false) : localIsVictory;
  const lives = isMultiplayer ? (syncGameState?.lives || 3) : localLives;
  const viewedPlayers = (isMultiplayer ? (syncGameState?.viewedPlayers || []) : []) as string[];

  // Reset visual de revelação própria ao mudar de fase
  useEffect(() => {
    if (phase === 'numbers') {
      setRevealedMyOwn(false);
    }
  }, [phase]);

  // Configuração dos sensores para Mobile e Desktop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // O usuário precisa mover 8px para começar a arrastar (evita cliques acidentais)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (phase === 'rolling') {
      if (isMultiplayer) {
        if (isHost) {
          const timeout = setTimeout(() => {
            const finalNumbers: Record<string, number> = {};
            const usedNumbers = new Set<number>();
            connectedPlayers.forEach(p => {
              let num;
              do { num = Math.floor(Math.random() * 100) + 1; } while (usedNumbers.has(num));
              usedNumbers.add(num);
              finalNumbers[p.name] = num;
            });
            syncService.syncState({
              phase: 'numbers',
              playerNumbers: finalNumbers,
              viewedPlayers: []
            });
          }, 2500);
          return () => clearTimeout(timeout);
        }
      } else {
        const timeout = setTimeout(() => {
          const finalNumbers: Record<string, number> = {};
          const usedNumbers = new Set<number>();
          players.forEach(p => {
            let num;
            do { num = Math.floor(Math.random() * 100) + 1; } while (usedNumbers.has(num));
            usedNumbers.add(num);
            finalNumbers[p] = num;
          });
          setLocalPlayerNumbers(finalNumbers);
          setLocalPhase('numbers');
        }, 2500);
        return () => clearTimeout(timeout);
      }
    }
  }, [phase, players, isMultiplayer, isHost, connectedPlayers]);

  const startRound = () => {
    if (isMultiplayer) {
      if (isHost) {
        let saboteurId = '';
        if (syncGameState?.saboteurMode && connectedPlayers.length > 0) {
          const randomIndex = Math.floor(Math.random() * connectedPlayers.length);
          saboteurId = connectedPlayers[randomIndex].id;
        }
        syncService.syncState({
          phase: 'rolling',
          viewedPlayers: [],
          orderedPlayers: connectedPlayers.map(p => p.name),
          saboteurId
        });
      }
    } else {
      if (saboteurMode && players.length > 0) {
        const randomIndex = Math.floor(Math.random() * players.length);
        setLocalSaboteurName(players[randomIndex]);
      } else {
        setLocalSaboteurName('');
      }
      setLocalPhase('rolling');
      setCurrentPlayerIndex(0);
      setIsRevealed(false);
      setLocalOrderedPlayers([...players]);
    }
  };

  const startOrdering = () => {
    let question = '';
    let color = '';

    const getThemeQuestions = (t: Theme) => {
      if (t.id.startsWith('custom_theme_')) {
        try {
          const saved = localStorage.getItem('ito_custom_questions_' + t.id);
          return saved ? JSON.parse(saved) : [];
        } catch {
          return [];
        }
      }
      return QUESTIONS_DB[t.id] || [];
    };

    const isFreeMode = themes.some(t => t.id === 'free');
    if (isFreeMode) {
      question = "MODO LIVRE: Inventem um desafio!";
      color = 'bg-slate-200';
    } else if (themes.length > 0) {
      const allQuestions = themes.flatMap(t => getThemeQuestions(t));
      if (allQuestions.length > 0) {
        const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        question = q;
        const t = themes.find(t => getThemeQuestions(t).includes(q)) || themes[0];
        color = t.color;
      }
    }

    if (isMultiplayer) {
      if (isHost) {
        syncService.syncState({
          phase: 'ordering',
          currentQuestion: question,
          currentThemeColor: color
        });
      }
    } else {
      setLocalCurrentQuestion(question);
      setLocalCurrentThemeColor(color);
      setLocalPhase('ordering');
    }
  };

  // Função chamada quando o arrasto termina
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      audioService.playTick();
      const oldIndex = orderedPlayers.indexOf(active.id as string);
      const newIndex = orderedPlayers.indexOf(over.id as string);
      const nextOrdered = arrayMove(orderedPlayers, oldIndex, newIndex);

      if (isMultiplayer) {
        if (isHost) {
          syncService.syncState({ orderedPlayers: nextOrdered });
        }
      } else {
        setLocalOrderedPlayers(nextOrdered);
      }
    }
  };

  const checkResult = () => {
    let correct = true;
    for (let i = 0; i < orderedPlayers.length - 1; i++) {
      if (playerNumbers[orderedPlayers[i]] > playerNumbers[orderedPlayers[i + 1]]) {
        correct = false;
        break;
      }
    }
    
    // Áudio e Háptico: comemoração ou erro
    if (correct) {
      audioService.playSuccess();
    } else {
      audioService.playFail();
    }
    triggerVibration(correct ? [100, 50, 100] : [300, 100, 300]);

    const isSabMode = isMultiplayer ? (syncGameState?.saboteurMode || false) : saboteurMode;

    if (isMultiplayer) {
      if (isHost) {
        const nextLives = correct ? lives : Math.max(0, lives - 1);
        if (isSabMode && !correct) {
          syncService.syncState({
            phase: 'saboteur-voting',
            saboteurVotes: {},
            lives: nextLives
          });
        } else {
          syncService.syncState({
            phase: 'result',
            isVictory: correct,
            lives: nextLives
          });
        }
      }
    } else {
      if (!correct) {
        setLocalLives(prev => Math.max(0, prev - 1));
      }
      if (isSabMode && !correct) {
        setLocalPhase('saboteur-voting');
      } else {
        setLocalIsVictory(correct);
        setLocalPhase('result');
      }
    }
  };

  const handleCastVote = (targetPlayerName: string) => {
    triggerVibration(50);
    audioService.playTick();
    if (isMultiplayer) {
      const currentVotes = { ...(syncGameState?.saboteurVotes || {}) };
      const myName = connectedPlayers.find(p => p.id === playerId)?.name || '';
      currentVotes[myName] = targetPlayerName;
      syncService.syncState({ saboteurVotes: currentVotes });
    }
  };

  const handleRevealSaboteur = () => {
    if (isMultiplayer && isHost) {
      audioService.playSuccess();
      const votes = syncGameState?.saboteurVotes || {};
      const voteCounts: Record<string, number> = {};
      (Object.values(votes) as string[]).forEach((v: string) => {
        voteCounts[v] = (voteCounts[v] || 0) + 1;
      });
      
      let mostVotedPlayer = '';
      let maxVotes = -1;
      Object.entries(voteCounts).forEach(([name, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          mostVotedPlayer = name;
        }
      });

      const actualSaboteurId = syncGameState?.saboteurId || '';
      const actualSaboteurName = connectedPlayers.find(p => p.id === actualSaboteurId)?.name || '';
      const groupWon = mostVotedPlayer === actualSaboteurName;

      syncService.syncState({
        phase: 'saboteur-reveal',
        mostVotedPlayer,
        actualSaboteurName,
        saboteurGroupWon: groupWon
      });
    }
  };

  const nextRound = () => {
    if (isMultiplayer) {
      if (isHost) {
        syncService.syncState({
          phase: 'init',
          round: round + 1,
          viewedPlayers: [],
          playerNumbers: {}
        });
      }
    } else {
      setLocalRound(r => r + 1);
      setLocalPhase('init');
    }
  };

  // Remover a lógica antiga de renderização sobreposta

  const mainThemeColor = themes.length === 1 ? themes[0].buttonColor : 'bg-yellow-400 hover:bg-yellow-350';

  return (
    <div className="flex-1 flex flex-col bg-slate-955 text-white relative h-full overflow-hidden font-sans">
      {phase === 'result' && isVictory && <Confetti />}
      <ReactionsOverlay />

      {/* Header Fixo */}
      <div className="p-4 flex items-center justify-between bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider font-outfit">RODADA {round}</span>
          <div className="flex items-center gap-1.5 text-sm font-black text-yellow-400 font-outfit uppercase">
            {themes.length === 1 ? themes[0].name : 'Mix de Temas'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleMute}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-350 transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="flex items-center gap-1 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart 
                key={i} 
                size={14} 
                className={`transition-all duration-300 ${i < lives ? 'text-red-500 fill-red-500 animate-pulse' : 'text-slate-700'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Área Central Rolável (Sem cortes) */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto overflow-x-hidden pb-6">
        {phase === 'init' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
              <div className="w-36 h-36 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl relative z-10">
                <Dices size={56} className="text-yellow-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white font-outfit">Sorteio de Números</h2>
              <p className="text-slate-400 max-w-xs mx-auto text-sm">Cada participante receberá uma carta secreta numerada de 1 a 100.</p>
            </div>
          </div>
        )}

        {phase === 'rolling' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-fade-in py-8">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-black text-yellow-450">?</span>
            </div>
            <p className="text-yellow-400 font-bold tracking-widest text-xs uppercase animate-pulse">Embaralhando Cartas...</p>
          </div>
        )}

        {phase === 'numbers' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-4">
            {isMultiplayer ? (
              <>
                <h2 className="text-2xl font-black text-white mb-1 font-outfit">Sua Carta Secreta</h2>
                <p className="text-slate-400 mb-6 uppercase tracking-widest text-[10px] font-bold">Olá, {connectedPlayers.find(p => p.id === playerId)?.name}</p>
                
                <div className="w-full max-w-[280px] aspect-[3/4.2] relative perspective-1000">
                  <div className={`w-full h-full relative transition-all duration-500 transform-style-3d bg-slate-900 rounded-3xl border-2 shadow-2xl ${
                      revealedMyOwn ? 'border-yellow-400 shadow-yellow-500/10' : 'border-white/5'
                    }`}>
                    {!revealedMyOwn ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="bg-slate-800/40 border border-white/5 p-5 rounded-full mb-6 animate-pulse">
                          <Lock size={48} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 font-outfit">Toque para ver</h3>
                        <p className="text-xs text-slate-450 leading-relaxed font-medium">Garanta que ninguém está espiando.</p>
                        <button onClick={() => { audioService.playFlip(); setRevealedMyOwn(true); triggerVibration(100); const currentViewed = syncGameState?.viewedPlayers || []; if (!currentViewed.includes(playerId)) { syncService.syncState({ viewedPlayers: [...currentViewed, playerId] }); } }} className="absolute inset-0 w-full h-full z-10" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-slate-900 rounded-3xl overflow-hidden">
                        <span className="text-slate-455 font-bold mb-3 uppercase tracking-widest text-[10px] font-outfit">Seu número secreto é</span>
                        <span className="text-8xl font-black text-yellow-450 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] font-outfit select-none animate-fade-in-scale">
                          {playerNumbers[connectedPlayers.find(p => p.id === playerId)?.name || ''] || 0}
                        </span>
                        {syncGameState?.saboteurMode && (
                          <div className="mt-4 px-3 py-1.5 rounded-full border text-[10px] font-black font-outfit tracking-wider uppercase animate-pulse">
                            {playerId === syncGameState?.saboteurId ? (
                              <span className="text-red-400 border-red-500/20 bg-red-950/20">😈 SABOTADOR</span>
                            ) : (
                              <span className="text-emerald-400 border-emerald-500/20 bg-emerald-950/20">😇 GRUPO</span>
                            )}
                          </div>
                        )}
                        <button onClick={() => { audioService.playFlip(); setRevealedMyOwn(false); }} className="absolute bottom-5 left-5 right-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold rounded-2xl transition-all text-xs font-outfit uppercase">
                          Esconder
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <div className="bg-slate-900/60 px-5 py-1.5 rounded-full border border-white/5 font-bold text-xs text-slate-400 font-outfit">
                    {viewedPlayers.length} de {connectedPlayers.length} Visualizaram
                  </div>
                  
                  {isHost ? (
                    <button
                      onClick={startOrdering}
                      className="py-3 px-6 bg-yellow-400 hover:bg-yellow-350 text-black font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 font-outfit uppercase"
                    >
                      AVANÇAR PARA SITUAÇÃO
                    </button>
                  ) : (
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-outfit animate-pulse">
                      Aguardando líder iniciar situação...
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-white mb-1 font-outfit">Vez de {players[currentPlayerIndex]}</h2>
                <p className="text-slate-400 mb-6 uppercase tracking-widest text-[10px] font-bold">Entregue o celular para ele(a)!</p>
                
                <div className="w-full max-w-[280px] aspect-[3/4.2] relative perspective-1000">
                  <div className={`w-full h-full relative transition-all duration-500 transform-style-3d bg-slate-900 rounded-3xl border-2 shadow-2xl ${
                      isRevealed ? 'border-yellow-400 shadow-yellow-500/10' : 'border-white/5'
                    }`}>
                    {!isRevealed ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="bg-slate-800/40 border border-white/5 p-5 rounded-full mb-6 animate-pulse">
                          <Lock size={48} className="text-slate-400" />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2 font-outfit">Toque para ver</h3>
                        <p className="text-xs text-slate-450 leading-relaxed font-medium">Garanta que ninguém está espiando.</p>
                        <button onClick={() => { audioService.playFlip(); setIsRevealed(true); triggerVibration(100); }} className="absolute inset-0 w-full h-full z-10" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-slate-900 rounded-3xl overflow-hidden">
                        <span className="text-slate-455 font-bold mb-3 uppercase tracking-widest text-[10px] font-outfit">Seu número secreto é</span>
                        <span className="text-8xl font-black text-yellow-450 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] font-outfit select-none animate-fade-in-scale">
                          {playerNumbers[players[currentPlayerIndex]]}
                        </span>
                        {saboteurMode && (
                          <div className="mt-4 px-3 py-1.5 rounded-full border text-[10px] font-black font-outfit tracking-wider uppercase animate-pulse">
                            {players[currentPlayerIndex] === localSaboteurName ? (
                              <span className="text-red-400 border-red-500/20 bg-red-950/20">😈 SABOTADOR</span>
                            ) : (
                              <span className="text-emerald-400 border-emerald-500/20 bg-emerald-950/20">😇 GRUPO</span>
                            )}
                          </div>
                        )}
                        <button onClick={() => {
                            audioService.playFlip();
                            setIsRevealed(false);
                            if (currentPlayerIndex < players.length - 1) {
                              setCurrentPlayerIndex(prev => prev + 1);
                            } else {
                              startOrdering();
                            }
                          }} 
                          className="absolute bottom-5 left-5 right-5 py-3.5 bg-yellow-400 hover:bg-yellow-350 text-black font-black text-base rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 flex-col leading-tight font-outfit"
                        >
                          <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest text-black">Entendido?</span>
                          {currentPlayerIndex < players.length - 1 ? "PRÓXIMO JOGADOR" : "IR PARA O JOGO"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 bg-slate-900/60 px-5 py-1.5 rounded-full border border-white/5 font-bold text-xs text-slate-400 font-outfit">
                  Jogador {currentPlayerIndex + 1} de {players.length}
                </div>
              </>
            )}
          </div>
        )}

        {phase === 'saboteur-voting' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-fade-in py-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full" />
              <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-red-500/20 flex items-center justify-center shadow-xl relative z-10">
                <span className="text-4xl animate-bounce">😈</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white font-outfit">Quem é o Sabotador?</h2>
              <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                A ordenação de cartas falhou! Alguém sabotou o grupo. Discutam e votem no seu suspeito principal.
              </p>
            </div>

            {isMultiplayer ? (
              <div className="w-full max-w-sm space-y-2 mt-4">
                {connectedPlayers.map((p) => {
                  const isMe = p.id === playerId;
                  const myName = connectedPlayers.find(pl => pl.id === playerId)?.name || '';
                  const votes = syncGameState?.saboteurVotes || {};
                  const playerVote = votes[myName];
                  const hasVoted = !!playerVote;
                  const totalVotesOnP = Object.values(votes).filter(v => v === p.name).length;

                  return (
                    <button
                      key={p.id}
                      onClick={() => !isMe && handleCastVote(p.name)}
                      disabled={isMe || hasVoted}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        playerVote === p.name
                          ? 'bg-red-500/10 border-red-500 text-red-300 font-bold'
                          : isMe
                          ? 'bg-slate-955/40 border-white/5 opacity-60 text-slate-400'
                          : 'bg-slate-900/50 border-white/5 text-white hover:border-red-500/30'
                      }`}
                    >
                      <span className="font-bold text-sm">{p.name} {isMe && '(Você)'}</span>
                      {hasVoted && totalVotesOnP > 0 && (
                        <span className="bg-red-500/25 text-red-400 border border-red-500/35 text-[10px] px-2.5 py-0.5 rounded-full font-bold font-outfit">
                          {totalVotesOnP} {totalVotesOnP === 1 ? 'voto' : 'votos'}
                        </span>
                      )}
                    </button>
                  );
                })}

                {isHost && (
                  <button
                    onClick={handleRevealSaboteur}
                    className="w-full mt-6 py-4.5 bg-red-650 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] font-outfit uppercase tracking-wider"
                  >
                    Revelar Votos do Grupo
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full max-w-sm space-y-2 mt-4">
                {players.map((playerName) => {
                  return (
                    <button
                      key={playerName}
                      onClick={() => { triggerVibration(50); audioService.playTick(); setLocalSuspect(playerName); }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        localSuspect === playerName
                          ? 'bg-red-500/10 border-red-500 text-red-300 font-bold'
                          : 'bg-slate-900/50 border-white/5 text-white hover:border-red-500/30 animate-fade-in'
                      }`}
                    >
                      <span className="font-bold text-sm">{playerName}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    if (!localSuspect) {
                      toast.error('Escolha um suspeito antes de avançar!');
                      return;
                    }
                    audioService.playSuccess();
                    setLocalPhase('saboteur-reveal');
                  }}
                  className="w-full mt-6 py-4.5 bg-red-650 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] font-outfit uppercase tracking-wider"
                >
                  Confirmar Suspeito
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'saboteur-reveal' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in py-4 text-center">
            {(() => {
              const actualSaboteurName = isMultiplayer 
                ? (syncGameState?.actualSaboteurName || '')
                : localSaboteurName;
              const suspectName = isMultiplayer
                ? (syncGameState?.mostVotedPlayer || '')
                : localSuspect;
              const groupWon = isMultiplayer
                ? (syncGameState?.saboteurGroupWon || false)
                : (localSuspect === localSaboteurName);

              return (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full animate-pulse" />
                    <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
                      <span className="text-5xl">{groupWon ? '🎉' : '😈'}</span>
                    </div>
                  </div>

                  <div className="space-y-2 animate-fade-in">
                    <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-wide">
                      {groupWon ? 'O GRUPO VENCEU!' : 'O SABOTADOR VENCEU!'}
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto font-medium leading-relaxed font-sans px-4">
                      {groupWon 
                        ? `Vocês encontraram o Sabotador! ${actualSaboteurName} foi desmascarado(a) com sucesso.`
                        : `O Sabotador passou despercebido! ${actualSaboteurName} enganou o grupo completamente.`}
                    </p>
                  </div>

                  <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-xl animate-fade-in-scale">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">O Sabotador era:</span>
                      <span className="text-red-400 font-black uppercase tracking-wider font-outfit">{actualSaboteurName}</span>
                    </div>
                    <div className="h-px bg-white/5 w-full" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-bold">Acusado pelo grupo:</span>
                      <span className="text-yellow-400 font-black uppercase tracking-wider font-outfit">{suspectName}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full max-w-xs pt-4 shrink-0">
                    {(!isMultiplayer || isHost) ? (
                      <button
                        onClick={() => {
                          if (isMultiplayer) {
                            syncService.syncState({
                              phase: 'init',
                              lives: 3,
                              round: 1,
                              viewedPlayers: [],
                              playerNumbers: {}
                            });
                          } else {
                            setLocalLives(3);
                            setLocalRound(1);
                            setLocalPhase('init');
                            setLocalSaboteurName('');
                            setLocalSuspect('');
                          }
                        }}
                        className="w-full bg-yellow-450 hover:bg-yellow-400 text-black font-black text-lg py-4 rounded-2xl shadow-md active:scale-95 flex items-center justify-center gap-2 font-outfit"
                      >
                        <RotateCcw size={20} /> JOGAR NOVAMENTE
                      </button>
                    ) : (
                      <div className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
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
                </>
              );
            })()}
          </div>
        )}

        {(phase === 'ordering' || phase === 'result') && (
          <div className="flex flex-col w-full animate-fade-in">
            {/* Bloco de Tema */}
            <div className={`${currentThemeColor || 'bg-slate-900/50'} rounded-3xl p-5 mb-5 shadow-lg border border-white/5 relative overflow-hidden shrink-0 transition-all duration-300`}>
              <div className={`flex items-center gap-2 mb-1.5 opacity-80 ${currentThemeColor ? 'text-slate-800' : 'text-slate-200'}`}>
                {themes.some(t => t.id === 'free') ? <Unlock size={14} /> : <Star size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-widest font-outfit">Situação Proposta</span>
              </div>
              <h3 className={`text-base sm:text-lg font-black leading-snug font-outfit ${currentThemeColor ? 'text-slate-955' : 'text-white'}`}>{currentQuestion}</h3>
              <Cloud className={`absolute -top-4 -right-4 opacity-10 transform rotate-12 pointer-events-none ${currentThemeColor ? 'text-white/20' : 'text-slate-500/10'}`} size={120} />
            </div>

            {/* Linha do Tempo de Resultados */}
            {phase === 'result' && (
              <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-5 mb-5 shadow-inner shrink-0 animate-fade-in relative">
                <div className="text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-8 text-center font-outfit">
                  Linha do Tempo dos Números (1 a 100)
                </div>
                <div className="relative h-2 flex items-center bg-slate-955 rounded-full border border-white/5 px-4 mx-2">
                  <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 rounded-full opacity-60" />
                  
                  {Object.entries(playerNumbers).map(([player, num]) => {
                    const leftPercent = 5 + ((num as number) - 1) * 0.9;
                    return (
                      <div 
                        key={player}
                        className="absolute transform -translate-x-1/2 flex flex-col items-center group"
                        style={{ left: `${leftPercent}%` }}
                      >
                        <div className="absolute bottom-4 bg-slate-900 border border-white/10 text-[9px] font-black text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1 font-outfit">
                          <span className="max-w-[40px] truncate">{player}</span>
                          <span className="text-yellow-400 font-bold">{(num as number)}</span>
                        </div>
                        
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-slate-955 shadow-md group-hover:scale-125 transition-transform flex items-center justify-center z-20">
                          <div className="w-1.5 h-1.5 bg-slate-955 rounded-full" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-bold px-3 mt-3 font-outfit">
                  <span>1 (MÍNIMO)</span>
                  <span>50 (MEIO)</span>
                  <span>100 (MÁXIMO)</span>
                </div>
              </div>
            )}

            <div className="flex justify-between px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0 font-outfit">
              <span>Menor (1)</span><span>Maior (100)</span>
            </div>

            {/* Lista Arrastável */}
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={handleDragEnd}
            >
              <div className="flex-1 z-10 pb-4">
                <SortableContext 
                  items={orderedPlayers} 
                  strategy={verticalListSortingStrategy}
                >
                  {orderedPlayers.map((player, index) => {
                    const num = playerNumbers[player];
                    const prevNum = index > 0 ? playerNumbers[orderedPlayers[index - 1]] : -1;
                    const isWrong = phase === 'result' && index > 0 && num < prevNum;
                    
                    return (
                      <SortablePlayerItem
                        key={player}
                        id={player}
                        player={player}
                        number={num}
                        index={index}
                        phase={phase}
                        isWrong={isWrong}
                        disabled={phase === 'result' || (isMultiplayer && !isHost)}
                      />
                    );
                  })}
                </SortableContext>
              </div>
            </DndContext>
          </div>
        )}
      </div>

      {/* Rodapé Fixo Flex (Nunca posicionado de forma absoluta) */}
      {(phase === 'init' || phase === 'ordering' || phase === 'result') && (
        <div className="p-6 bg-slate-900 border-t border-white/5 z-40 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
        {phase === 'init' && (
          (!isMultiplayer || isHost) ? (
            <button onClick={startRound} className={`w-full ${mainThemeColor} text-black font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit`} style={{ animationDelay: '0.1s' }}>
              <Dices size={22} /> <span>SORTEAR CARTAS</span>
            </button>
          ) : (
            <div className="w-full bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">Aguardando líder sortear cartas...</span>
            </div>
          )
        )}
        {phase === 'ordering' && (
          (!isMultiplayer || isHost) ? (
            <button onClick={checkResult} className="w-full bg-green-500 hover:bg-green-400 text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit">
              <Check size={24} /> <span>REVELAR ORDEM</span>
            </button>
          ) : (
            <div className="w-full bg-slate-955/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-yellow-450 animate-ping" />
              <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">Líder organizando e revelando ordem...</span>
            </div>
          )
        )}
        {phase === 'result' && (
          <div className="flex flex-col gap-3 w-full">
            {lives === 0 ? (
              <div className="flex flex-col gap-3 w-full animate-fade-in">
                <div className="bg-red-650 text-white font-black text-lg py-4 rounded-2xl text-center animate-pulse font-outfit">
                  FIM DE JOGO (SEM VIDAS!)
                </div>
                {(!isMultiplayer || isHost) ? (
                  <button 
                    onClick={() => {
                      if (isMultiplayer) {
                        syncService.syncState({
                          phase: 'init',
                          lives: 3,
                          round: 1,
                          viewedPlayers: [],
                          playerNumbers: {}
                        });
                      } else {
                        setLocalLives(3);
                        setLocalRound(1);
                        setLocalPhase('init');
                      }
                    }} 
                    className="w-full bg-yellow-400 hover:bg-yellow-350 text-black font-black text-lg py-4 rounded-2xl shadow-md active:scale-95 flex items-center justify-center gap-2 font-outfit"
                  >
                    <RefreshCw size={20} /> <span>RECOMEÇAR</span>
                  </button>
                ) : (
                  <div className="w-full bg-slate-955/50 p-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    <span className="text-xs text-slate-400 font-black uppercase tracking-wider font-outfit">Aguardando líder reiniciar...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3 w-full animate-fade-in">
                <div className={`flex-1 rounded-2xl flex items-center justify-center font-black text-lg py-4 font-outfit shadow-md ${isVictory ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {isVictory ? 'SUCESSO!' : 'FALHA!'}
                </div>
                {(!isMultiplayer || isHost) ? (
                  <button onClick={nextRound} className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl shadow-md active:scale-95 transition-colors shrink-0">
                    <RefreshCw size={22} />
                  </button>
                ) : (
                  <div className="bg-slate-955/50 px-4 rounded-2xl border border-white/5 text-center flex items-center justify-center gap-3 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-450 animate-ping" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      )}
      {isMultiplayer && (phase === 'numbers' || phase === 'ordering' || phase === 'result') && (
        <div className="absolute bottom-28 left-0 right-0 flex justify-center z-45 pointer-events-none">
          <ReactionsTray />
        </div>
      )}
    </div>
  );
};
export default GameScreen;