import { useState, useEffect } from 'react';
import { ChevronLeft, Dices, Check, Eye, Unlock, Star, Cloud, ArrowUp, ArrowDown, RefreshCw, ArrowRight, Lock } from 'lucide-react';
import type { Theme } from './data';
//import { getSecureRandomInt } from './utils/secureRandom';


// Banco de Perguntas Simulado (DB)
const QUESTIONS_DB: Record<string, string[]> = {
    classic: [
        "O quão útil seria este objeto em um apocalipse zumbi?",
        "O quão perigoso é este animal?",
        "Nível de popularidade desta celebridade.",
        "O quão difícil é esta profissão?",
        "O quão assustador é este filme?",
        "Nível de inteligência deste personagem fictício.",
        "Filmes do George Melies"
    ],
    anime: [
        "Melhores Cavaleiros de Ouro",
        "Cavaleiros de Bronze mais fortes ",
        "Armaduras mais bonitas de Saint Seiya",
        "Personagens mais injustiçados da obra",
        "Vilões mais memoráveis de Saint Seiya",
        "Melhores lutas dos animes",
        "Sagas de Saint Seiya",
        "Cavaleiros mais leais à Athena",
        "Personagens com o melhor desenvolvimento",
        "Momentos mais emocionantes dos animes",
        "Transformações mais impactantes de Dragon Ball",
        "Vilões mais ameaçadores",
        "Personagens mais fortes ",
        "Sagas de Dragon Ball",
        "Personagens mais desperdiçados pela história",
        "Lutas mais épicas de Dragon Ball Z e Super",
        "Personagens mais carismáticos",
        "Melhores treinamentos",
        "Treinamentos mais dificeis",
        "Mortes mais marcantes (e mais traumáticas)",
        "Melhores protagonistas dos animes",
        "Piores vilões já criados",
        "Personagens mais overpower dos animes",
        "Animes com as melhores trilhas sonoras",
        "Personagens mais inteligentes dos animes",
        "Animes que envelheceram bem",
        "Animes que envelheceram mal",
        "Personagens secundários que roubam a cena",
        "Animes com as melhores lutas",
        "Animes superestimados"
    ]
};

const Confetti = () => {
  // Cria 50 partículas com posições e cores aleatórias - usando lazy initializer para evitar repetição no render
  const [particles] = useState(() => Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#FACC15', '#4ADE80', '#60A5FA', '#F472B6'][Math.floor(Math.random() * 4)],
    animationDuration: `${2 + Math.random() * 3}s`
  })));

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
            animationDuration: p.animationDuration,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  );
};

const GameScreen = ({ onBack, players, themes }: { onBack: () => void, players: string[], themes: Theme[] }) => {
  const [phase, setPhase] = useState<'init' | 'rolling' | 'numbers' | 'ordering' | 'result'>('init');
  const [playerNumbers, setPlayerNumbers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentThemeColor, setCurrentThemeColor] = useState<string>('');
  const [round, setRound] = useState(1);
  const [orderedPlayers, setOrderedPlayers] = useState<string[]>([]);
  const [isVictory, setIsVictory] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [playersSeen, setPlayersSeen] = useState<string[]>([]);

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
    setPlayersSeen([]);
    setViewingPlayer(null);
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

  const movePlayer = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedPlayers];
    if (direction === 'up' && index > 0) [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    else if (direction === 'down' && index < newOrder.length - 1) [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setOrderedPlayers(newOrder);
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

  if (viewingPlayer) {
    return (
      <div className="w-full h-full absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 animate-fade-in">
         <div className="absolute inset-0 bg-black opacity-95"></div>
         <div className="relative z-10 w-full max-w-sm bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col items-center text-center space-y-6">
            {!isRevealed ? (
              <>
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center animate-pulse mb-4">
                  <Lock className="text-yellow-500" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-white">Passe para <span className="text-yellow-400 block text-4xl mt-2">{viewingPlayer}</span></h2>
                <p className="text-slate-400 text-sm">Garanta que ninguém mais está olhando.</p>
                <button onClick={() => setIsRevealed(true)} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl py-4 rounded-xl mt-4 shadow-lg active:scale-95">REVELAR</button>
              </>
            ) : (
              <>
                 <div className="flex flex-col items-center animate-bounce-subtle py-6">
                    <span className="text-slate-400 font-medium mb-4 uppercase tracking-widest text-xs">Seu número é</span>
                    <span className="text-9xl font-black text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]">{playerNumbers[viewingPlayer]}</span>
                 </div>
                 <div className="w-full pt-6 border-t border-slate-700">
                    <button onClick={() => { setPlayersSeen([...playersSeen, viewingPlayer]); setViewingPlayer(null); }} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg py-4 rounded-xl transition-colors">OK, MEMORIZEI</button>
                 </div>
              </>
            )}
         </div>
      </div>
    );
  }

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

      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
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
          <div className="animate-fade-in pb-24">
            <p className="text-center text-slate-400 mb-6">Toque no seu nome. <br/><strong className="text-white">Mantenha segredo!</strong></p>
            <div className="grid grid-cols-2 gap-4">
                {players.map((player) => {
                    const hasSeen = playersSeen.includes(player);
                    return (
                      <button key={player} onClick={() => !hasSeen && setViewingPlayer(player)} disabled={hasSeen} className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center h-32 relative overflow-hidden ${hasSeen ? 'bg-slate-800/40 border-slate-800 opacity-50' : 'bg-slate-800 border-slate-600 hover:border-yellow-400 shadow-lg active:scale-95'}`}>
                          <span className="text-slate-200 font-bold mb-2 truncate w-full text-center text-lg">{player}</span>
                          {hasSeen ? <Check size={28} className="text-green-500" /> : <Eye size={28} className="text-yellow-400" />}
                      </button>
                    );
                })}
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
                
                {/* Linha conectora visual */}
                {/* <div className="absolute left-9 top-[280px] bottom-32 w-1 bg-slate-800 -z-0"></div> */}

                <div className="flex-1 space-y-3 z-10 overflow-y-auto pb-4">
                    {orderedPlayers.map((player, index) => {
                        const num = playerNumbers[player];
                        const prevNum = index > 0 ? playerNumbers[orderedPlayers[index-1]] : -1;
                        // Lógica de erro: Se o atual for menor que o anterior, há uma quebra de sequência visual
                        const isWrong = phase === 'result' && index > 0 && num < prevNum;
                        
                        return (
                            <div key={player} className={`flex items-center p-3 rounded-xl border-2 transition-all duration-500 ${phase === 'result' ? (isWrong ? 'bg-red-900/40 border-red-500/50' : 'bg-slate-800 border-green-500/30') : 'bg-slate-800 border-slate-700 shadow-md'}`}>
                                <div className="flex flex-col gap-1 mr-3">
                                    {phase === 'ordering' && (
                                      <>
                                        <button onClick={() => movePlayer(index, 'up')} disabled={index === 0} className="p-1 text-slate-500 hover:text-white disabled:opacity-0"><ArrowUp size={20} /></button>
                                        <button onClick={() => movePlayer(index, 'down')} disabled={index === orderedPlayers.length - 1} className="p-1 text-slate-500 hover:text-white disabled:opacity-0"><ArrowDown size={20} /></button>
                                      </>
                                    )}
                                    {phase === 'result' && <div className="w-8 flex justify-center text-slate-600 font-bold">#{index+1}</div>}
                                </div>
                                <div className="flex-1 font-bold text-white text-lg">{player}</div>
                                {phase === 'result' ? (
                                    <div className={`px-4 py-2 rounded-lg font-black text-xl min-w-[60px] text-center transform transition-all ${isWrong ? 'bg-red-500 text-white scale-110 shadow-red-500/50 shadow-lg' : 'bg-green-500 text-white'}`}>
                                        {num}
                                    </div>
                                ) : (
                                    <div className="w-12 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xl">?</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800 z-40 absolute bottom-0 w-full shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {phase === 'init' && (
            <button onClick={startRound} className={`w-full ${mainThemeColor} text-black font-black text-xl py-4 rounded-2xl shadow-lg active:scale-95 flex items-center justify-center gap-2`}>
                <Dices size={24} /> <span>SORTEAR</span>
            </button>
        )}
        {phase === 'numbers' && (
            <button onClick={startOrdering} disabled={playersSeen.length < players.length} className={`w-full font-black text-xl py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${playersSeen.length < players.length ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : `${mainThemeColor} text-black active:scale-95 animate-pulse`}`}>
                {playersSeen.length < players.length ? <span>AGUARDANDO ({playersSeen.length}/{players.length})</span> : <><span>ORDENAR</span><ArrowRight size={24} /></>}
            </button>
        )}
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
