import { useState, useEffect } from 'react';
import { ChevronLeft, Dices, Check, Unlock, Star, Cloud, RefreshCw, Lock, GripVertical, Heart } from 'lucide-react';
import { QUESTIONS_DB } from './data';
import type { Theme } from '../data';
import type { DragEndEvent } from '@dnd-kit/core';

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
}

const SortablePlayerItem = ({ id, player, number, index, phase, isWrong }: SortableItemProps) => {
  // Hook do DND Kit para tornar o item arrastável
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id, disabled: phase === 'result' });

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

// --- Componente Principal ---
const GameScreen = ({ onBack, players, themes }: { onBack: () => void, players: string[], themes: Theme[] }) => {
  const [phase, setPhase] = useState<'init' | 'rolling' | 'numbers' | 'ordering' | 'result'>('init');
  const [playerNumbers, setPlayerNumbers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentThemeColor, setCurrentThemeColor] = useState<string>('');
  const [round, setRound] = useState(1);
  const [orderedPlayers, setOrderedPlayers] = useState<string[]>([]);
  const [isVictory, setIsVictory] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [lives, setLives] = useState(3);

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
      const timeout = setTimeout(() => {
        const finalNumbers: Record<string, number> = {};
        const usedNumbers = new Set<number>();
        players.forEach(p => {
          let num;
          do { num = Math.floor(Math.random() * 100) + 1; } while (usedNumbers.has(num));
          usedNumbers.add(num);
          finalNumbers[p] = num;
        });
        setPlayerNumbers(finalNumbers);
        setPhase('numbers');
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [phase, players]);

  const startRound = () => {
    setPhase('rolling');
    setCurrentPlayerIndex(0);
    setIsRevealed(false);
    setOrderedPlayers([...players]);
  };

  const startOrdering = () => {
    const isFreeMode = themes.some(t => t.id === 'free');
    if (isFreeMode) {
      setCurrentQuestion("MODO LIVRE: Inventem um desafio!");
      setCurrentThemeColor('bg-slate-200');
    } else if (themes.length > 0) {
      const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
      if (allQuestions.length > 0) {
        const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        setCurrentQuestion(q);
        const t = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(q)) || themes[0];
        setCurrentThemeColor(t.color);
      }
    }
    setPhase('ordering');
  };

  // Função chamada quando o arrasto termina
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setOrderedPlayers((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
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
    
    if (!correct) {
      setLives(prev => Math.max(0, prev - 1));
    }
    
    setIsVictory(correct);
    setPhase('result');
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setPhase('init');
  };

  // Remover a lógica antiga de renderização sobreposta

  const mainThemeColor = themes.length === 1 ? themes[0].buttonColor : 'bg-yellow-400 hover:bg-yellow-350';

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white relative h-full overflow-hidden font-sans">
      {phase === 'result' && isVictory && <Confetti />}

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
                    <p className="text-xs text-slate-450 leading-relaxed font-medium">Nenhum outro jogador pode olhar.</p>
                    <button onClick={() => setIsRevealed(true)} className="absolute inset-0 w-full h-full z-10" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-slate-900 rounded-3xl overflow-hidden">
                    <span className="text-slate-450 font-bold mb-3 uppercase tracking-widest text-[10px] font-outfit">Seu número secreto é</span>
                    <span className="text-8xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] font-outfit select-none">{playerNumbers[players[currentPlayerIndex]]}</span>
                    <button onClick={() => {
                        setIsRevealed(false);
                        if (currentPlayerIndex < players.length - 1) {
                          setCurrentPlayerIndex(prev => prev + 1);
                        } else {
                          startOrdering();
                        }
                      }} 
                      className="absolute bottom-5 left-5 right-5 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-base rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 flex-col leading-tight font-outfit"
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
                <div className="relative h-2 flex items-center bg-slate-950 rounded-full border border-white/5 px-4 mx-2">
                  <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 rounded-full opacity-60" />
                  
                  {Object.entries(playerNumbers).map(([player, num]) => {
                    const leftPercent = 5 + (num - 1) * 0.9;
                    return (
                      <div 
                        key={player}
                        className="absolute transform -translate-x-1/2 flex flex-col items-center group"
                        style={{ left: `${leftPercent}%` }}
                      >
                        <div className="absolute bottom-4 bg-slate-900 border border-white/10 text-[9px] font-black text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1 font-outfit">
                          <span className="max-w-[40px] truncate">{player}</span>
                          <span className="text-yellow-400 font-bold">{num}</span>
                        </div>
                        
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-slate-950 shadow-md group-hover:scale-125 transition-transform flex items-center justify-center z-20">
                          <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
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
      <div className="p-6 bg-slate-900 border-t border-white/5 z-40 shrink-0 safe-bottom shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
        {phase === 'init' && (
          <button onClick={startRound} className={`w-full ${mainThemeColor} text-black font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit`} style={{ animationDelay: '0.1s' }}>
            <Dices size={22} /> <span>SORTEAR CARTAS</span>
          </button>
        )}
        {phase === 'ordering' && (
          <button onClick={checkResult} className="w-full bg-green-500 hover:bg-green-400 text-white font-black text-lg py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-outfit">
            <Check size={24} /> <span>REVELAR ORDEM</span>
          </button>
        )}
        {phase === 'result' && (
          <div className="flex flex-col gap-3 w-full">
            {lives === 0 ? (
              <div className="flex flex-col gap-3 w-full animate-fade-in">
                <div className="bg-red-650 text-white font-black text-lg py-4 rounded-2xl text-center animate-pulse font-outfit">
                  FIM DE JOGO (SEM VIDAS!)
                </div>
                <button 
                  onClick={() => {
                    setLives(3);
                    setRound(1);
                    setPhase('init');
                  }} 
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black text-lg py-4 rounded-2xl shadow-md active:scale-95 flex items-center justify-center gap-2 font-outfit"
                >
                  <RefreshCw size={20} /> <span>RECOMEÇAR</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-3 w-full animate-fade-in">
                <div className={`flex-1 rounded-2xl flex items-center justify-center font-black text-lg py-4 font-outfit shadow-md ${isVictory ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {isVictory ? 'SUCESSO!' : 'FALHA!'}
                </div>
                <button onClick={nextRound} className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-2xl shadow-md active:scale-95 transition-colors shrink-0">
                  <RefreshCw size={22} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default GameScreen;