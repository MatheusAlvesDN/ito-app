import { useState, useEffect } from 'react';
import { ChevronLeft, Dices, Check, Unlock, Star, Cloud, RefreshCw, Lock, GripVertical } from 'lucide-react';
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
    setIsVictory(correct);
    setPhase('result');
  };

  const nextRound = () => {
    setRound(r => r + 1);
    setPhase('init');
  };

  // Remover a lógica antiga de renderização sobreposta

  const mainThemeColor = themes.length === 1 ? themes[0].buttonColor : 'bg-yellow-400 hover:bg-yellow-300';

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white relative h-full">
      {phase === 'result' && isVictory && <Confetti />}

      <div className={`p-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 bg-slate-900/80 border-b border-white/5 pt-8 md:pt-4`}>
        <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><ChevronLeft size={24} /></button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RODADA {round}</span>
          <div className={`flex items-center gap-2 text-sm font-bold ${themes.length === 1 ? themes[0].textColor.replace('text-', 'text-') : 'text-yellow-400'}`}>
            {themes.length === 1 ? themes[0].name : 'Mix de Temas'}
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-y-auto overflow-x-hidden">
        {phase === 'init' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="w-40 h-40 rounded-full bg-slate-800 border-8 border-slate-700 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <Dices size={64} className="text-yellow-400" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black text-white">Novo Sorteio</h2>
              <p className="text-slate-400 max-w-xs mx-auto text-lg">Todos receberão novos números secretos.</p>
            </div>
          </div>
        )}

        {phase === 'rolling' && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="text-6xl font-black text-slate-700 animate-pulse">?</div>
            <p className="text-yellow-400 font-bold tracking-widest uppercase animate-pulse">Embaralhando...</p>
          </div>
        )}

        {phase === 'numbers' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in pb-24 mt-8">
            <h2 className="text-2xl font-black text-white mb-2">Vez de {players[currentPlayerIndex]}</h2>
            <p className="text-slate-400 mb-6 uppercase tracking-widest text-xs font-bold">Passe o celular para ele(a)!</p>
            
            <div className="w-full max-w-sm aspect-[3/4] relative perspective-1000">
              <div className={`w-full h-full relative transition-all duration-500 transform-style-3d bg-slate-800 rounded-3xl border-4 ${
                  isRevealed ? 'border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.3)]' : 'border-slate-700 shadow-xl'
                }`}>
                {!isRevealed ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-slate-700/50 p-6 rounded-full mb-6 animate-pulse">
                      <Lock size={64} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Toque para ver</h3>
                    <p className="text-slate-400">Garanta que ninguém mais está olhando!</p>
                    <button onClick={() => setIsRevealed(true)} className="absolute inset-0 w-full h-full z-10" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-slate-800 rounded-3xl overflow-hidden">
                    <span className="text-slate-400 font-medium mb-4 uppercase tracking-widest text-xs">Seu número é</span>
                    <span className="text-9xl font-black text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]">{playerNumbers[players[currentPlayerIndex]]}</span>
                    <button onClick={() => {
                        setIsRevealed(false);
                        if (currentPlayerIndex < players.length - 1) {
                          setCurrentPlayerIndex(prev => prev + 1);
                        } else {
                          startOrdering();
                        }
                      }} 
                      className="absolute bottom-6 left-6 right-6 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl rounded-xl transition-colors z-20 shadow-lg active:scale-95 flex items-center justify-center gap-2 flex-col leading-tight"
                    >
                      <span className="text-base font-medium opacity-80 uppercase tracking-wider text-black">Memorizou?</span>
                      {currentPlayerIndex < players.length - 1 ? "PRÓXIMO" : "IR PARA O JOGO"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 bg-slate-800 px-6 py-2 rounded-full border border-slate-700 font-bold text-slate-400">
              Jogador {currentPlayerIndex + 1} de {players.length}
            </div>
          </div>
        )}

        {(phase === 'ordering' || phase === 'result') && (
          <div className="flex flex-col h-full animate-fade-in pb-24">
            <div className={`${currentThemeColor || 'bg-slate-800'} rounded-2xl p-6 mb-6 shadow-lg border-2 border-white/10 relative overflow-hidden transition-all duration-500 shrink-0`}>
              <div className="flex items-center gap-2 mb-2 opacity-70 relative z-10 text-slate-900">
                {themes.some(t => t.id === 'free') ? <Unlock size={16} /> : <Star size={16} />}
                <span className="text-xs font-bold uppercase tracking-widest">Tema</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight relative z-10 drop-shadow-sm">{currentQuestion}</h3>
              <Cloud className="absolute -top-4 -right-4 text-white opacity-20 transform rotate-12" size={120} />
            </div>

            <div className="flex justify-between px-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">
              <span>Menor (1)</span><span>Maior (100)</span>
            </div>

            {/* Contexto DND Kit */}
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={handleDragEnd}
            >
              <div className="flex-1 z-10 overflow-y-auto pb-4">
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

      <div className="p-6 bg-slate-900 border-t border-slate-800 z-40 absolute bottom-0 w-full shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {phase === 'init' && (
          <button onClick={startRound} className={`w-full ${mainThemeColor} text-black font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 flex items-center justify-center gap-2`}>
            <Dices size={24} /> <span>SORTEAR</span>
          </button>
        )}
        {/* Numbers phase footer logic removed since it proceeds automatically */}
        {phase === 'ordering' && (
          <button onClick={checkResult} className="w-full bg-green-500 hover:bg-green-400 text-white font-black text-xl py-4 rounded-2xl shadow-[0_4px_14px_rgba(34,197,94,0.4)] active:scale-95 flex items-center justify-center gap-2">
            <Check size={28} /> <span>REVELAR ORDEM</span>
          </button>
        )}
        {phase === 'result' && (
          <div className="flex gap-3">
            <div className={`flex-1 rounded-2xl flex items-center justify-center font-black text-xl ${isVictory ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isVictory ? 'SUCESSO!' : 'FALHA!'}
            </div>
            <button onClick={nextRound} className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-2xl shadow-lg active:scale-95">
              <RefreshCw size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default GameScreen;