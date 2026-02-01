import { useState, useEffect } from 'react';
import { ChevronLeft, Layers, Dices, Check, Eye, Unlock, Star, Cloud, ArrowUp, ArrowDown, Trophy, XCircle, AlertCircle, RefreshCw, ArrowRight, Lock } from 'lucide-react';
import type { Theme } from './data';

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

// 4. Tela de Jogo Completa (Com lógica de Múltiplos Temas e Modo Livre)
const GameScreen = ({ onBack, players, themes }: { onBack: () => void, players: string[], themes: Theme[] }) => {
  const [phase, setPhase] = useState<'init' | 'rolling' | 'numbers' | 'ordering' | 'result'>('init');
  const [playerNumbers, setPlayerNumbers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentThemeColor, setCurrentThemeColor] = useState<string>('');
  const [round, setRound] = useState(1);
  const [orderedPlayers, setOrderedPlayers] = useState<string[]>([]);
  const [isVictory, setIsVictory] = useState(false);

  // Estado para controle de segredo
  const [viewingPlayer, setViewingPlayer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [playersSeen, setPlayersSeen] = useState<string[]>([]);

  // Efeito de rolagem de números
  useEffect(() => {
    if (phase === 'rolling') {
      const timeout = setTimeout(() => {
        // Sorteio Silencioso (Números únicos)
        const finalNumbers: Record<string, number> = {};
        const usedNumbers = new Set<number>();

        players.forEach(p => {
            let num;
            do {
                num = Math.floor(Math.random() * 100) + 1;
            } while (usedNumbers.has(num));
            usedNumbers.add(num);
            finalNumbers[p] = num;
        });

        setPlayerNumbers(finalNumbers);
        setPhase('numbers');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [phase, players]);

  // Função para começar a rodada
  const startRound = () => {
    setPhase('rolling');
    setPlayersSeen([]);
    setViewingPlayer(null);
    setIsRevealed(false);
    setOrderedPlayers([...players]);
  };

  // Funções de visualização secreta
  const openSecretView = (player: string) => { setViewingPlayer(player); setIsRevealed(false); };
  const revealNumber = () => setIsRevealed(true);
  const closeSecretView = () => {
    if (viewingPlayer) {
      setPlayersSeen([...playersSeen, viewingPlayer]);
      setViewingPlayer(null);
      setIsRevealed(false);
    }
  };

  // Transição para Ordenação (Modificada para Suportar MODO LIVRE)
  const startOrdering = () => {
    // Verifica se está no modo livre (ID 'free')
    const isFreeMode = themes.some(t => t.id === 'free');

    if (isFreeMode) {
      setCurrentQuestion("MODO LIVRE: Inventem um desafio!");
      setCurrentThemeColor('bg-slate-200'); // Cor neutra para o modo livre
      setPhase('ordering');
      return;
    }

    if (themes.length > 0) {
      // Agrupa todas as perguntas dos temas selecionados
      const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);

      if (allQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * allQuestions.length);
          const question = allQuestions[randomIndex];
          setCurrentQuestion(question);

          const sourceTheme = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(question)) || themes[0];
          setCurrentThemeColor(sourceTheme.color);

          setPhase('ordering');
      }
    }
  };

  const movePlayer = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedPlayers];
    if (direction === 'up' && index > 0) {
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setOrderedPlayers(newOrder);
  };

  const checkResult = () => {
    let correct = true;
    for (let i = 0; i < orderedPlayers.length - 1; i++) {
        const p1 = orderedPlayers[i];
        const p2 = orderedPlayers[i + 1];
        if (playerNumbers[p1] > playerNumbers[p2]) {
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
    setPlayerNumbers({});
    setCurrentQuestion('');
    setPlayersSeen([]);
  };

  if (themes.length === 0) return null;

  // Cor principal para a UI
  const mainThemeColor = themes.length === 1 ? themes[0].buttonColor : 'bg-yellow-400 hover:bg-yellow-300';
  //const textColorClass = themes.length === 1 ? themes[0].textColor : 'text-slate-200';

  // --- RENDERIZAÇÃO DO MODO SECRETO ---
  if (viewingPlayer) {
    return (
      <div className="w-full h-full absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 animate-fade-in">
         <div className="absolute inset-0 bg-black opacity-90"></div>
         <div className="relative z-10 w-full max-w-sm bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl flex flex-col items-center text-center space-y-8">
            {!isRevealed ? (
              <>
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center animate-pulse">
                  <Lock className="text-slate-400" size={40} />
                </div>
                <div>
                  <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Segurança</h3>
                  <h2 className="text-2xl font-bold text-white">Passe o celular para <br/><span className="text-yellow-400 text-3xl">{viewingPlayer}</span></h2>
                </div>
                <button onClick={revealNumber} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl py-4 rounded-xl shadow-lg transition-transform active:scale-95">REVELAR NÚMERO</button>
              </>
            ) : (
              <>
                 <div className="flex flex-col items-center animate-bounce-subtle">
                    <span className="text-slate-400 font-medium mb-4">Seu número secreto é:</span>
                    <span className="text-8xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">{playerNumbers[viewingPlayer]}</span>
                 </div>
                 <div className="w-full pt-8 border-t border-slate-700">
                    <p className="text-slate-400 text-sm mb-4">Memorizou? Não conte pra ninguém!</p>
                    <button onClick={closeSecretView} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg py-3 rounded-xl transition-colors">OK, ESCONDER</button>
                 </div>
              </>
            )}
         </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PADRÃO DO JOGO ---
  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white relative">
      {/* Barra superior */}
      <div className={`p-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-20 bg-slate-900/90 border-b border-white/5 pt-8 md:pt-4`}>
        <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">RODADA {round}</span>
            <div className={`flex items-center gap-1 text-sm font-bold ${themes.length === 1 ? themes[0].textColor : 'text-yellow-400'}`}>
                {themes.length === 1 ? themes[0].name : (
                    <span className="flex items-center gap-1">Mix de Temas <Layers size={14}/></span>
                )}
            </div>
        </div>
        <div className="w-10" />
      </div>

      {/* Conteúdo Central */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">

        {/* FASE 1: INÍCIO */}
        {phase === 'init' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
              <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-4">
                  <Dices size={48} className="text-yellow-400" />
              </div>
              <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-white">Hora do Sorteio!</h2>
                  <p className="text-slate-400 max-w-xs mx-auto">Cada jogador receberá um número aleatório secreto.</p>
              </div>
           </div>
        )}

        {/* FASE 2: EMBARALHANDO */}
        {phase === 'rolling' && (
           <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-fade-in">
              <div className="flex gap-2">
                 <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-slate-400 font-bold tracking-widest uppercase">Gerando segredos...</p>
           </div>
        )}

        {/* FASE 3: VER NÚMEROS */}
        {phase === 'numbers' && (
          <>
            <p className="text-center text-slate-400 mb-4 animate-fade-in">
              Toque no seu nome para ver seu número. <strong className="text-white block">Mantenha em segredo!</strong>
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {players.map((player) => {
                    const hasSeen = playersSeen.includes(player);
                    return (
                      <button
                        key={player}
                        onClick={() => !hasSeen && openSecretView(player)}
                        disabled={hasSeen}
                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center relative overflow-hidden h-32
                          ${hasSeen ? 'bg-slate-800/50 border-slate-700/50 cursor-default opacity-60' : 'bg-slate-800 border-slate-600 hover:border-yellow-400 hover:bg-slate-700 cursor-pointer shadow-lg active:scale-95'}`}
                      >
                          <span className="text-slate-300 font-bold mb-2 truncate w-full text-center">{player}</span>
                          {hasSeen ? <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center"><Check size={24} /></div>
                                   : <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center"><Eye size={24} /></div>}
                          <span className="absolute bottom-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">{hasSeen ? 'Pronto' : 'Ver Agora'}</span>
                      </button>
                    );
                })}
            </div>
          </>
        )}

        {/* FASE 4: ORDENAÇÃO (MODIFICADO PARA SUPORTAR MODO LIVRE) */}
        {phase === 'ordering' && (
            <div className="flex flex-col h-full animate-fade-in pb-20">
                {/* Card da Pergunta */}
                <div className={`${currentThemeColor || 'bg-slate-800'} rounded-2xl p-6 mb-6 shadow-lg border-2 border-white/10 relative overflow-hidden`}>
                    <div className="flex items-center gap-2 mb-2 opacity-70 relative z-10">
                        {/* Se for modo livre, usa ícone de desbloqueio, senão estrela */}
                        {themes.some(t => t.id === 'free') ? <Unlock className="text-slate-900" size={20} /> : <Star className="text-slate-900" size={20} />}
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Tema da Vez</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight relative z-10">{currentQuestion}</h3>

                    {/* Elemento decorativo de fundo */}
                    <div className="absolute top-[-20%] right-[-10%] opacity-10">
                       <Cloud size={100} className="fill-current text-white" />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Menor (1)</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Maior (100)</span>
                </div>

                {/* Lista Ordenável */}
                <div className="flex-1 space-y-3">
                    {orderedPlayers.map((player, index) => (
                        <div key={player} className="flex items-center bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-sm animate-fade-in">
                            <div className="flex flex-col gap-1 mr-3">
                                <button onClick={() => movePlayer(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-white disabled:opacity-20"><ArrowUp size={20} /></button>
                                <button onClick={() => movePlayer(index, 'down')} disabled={index === orderedPlayers.length - 1} className="p-1 text-slate-400 hover:text-white disabled:opacity-20"><ArrowDown size={20} /></button>
                            </div>
                            <div className="flex-1">
                                <span className="font-bold text-lg text-white">{player}</span>
                            </div>
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm">
                                ?
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-xs text-slate-500 mt-4">Discutam e ordenem a lista!</p>
            </div>
        )}

        {/* FASE 5: RESULTADO */}
        {phase === 'result' && (
            <div className="flex flex-col h-full animate-fade-in pb-20">
                <div className={`p-6 rounded-3xl mb-6 text-center border-4 ${isVictory ? 'bg-green-500/20 border-green-500' : 'bg-red-500/20 border-red-500'}`}>
                    {isVictory ? (
                        <>
                            <Trophy className="mx-auto text-green-400 mb-2" size={48} />
                            <h2 className="text-3xl font-black text-green-400">SUCESSO!</h2>
                            <p className="text-green-200 text-sm mt-1">A ordem está perfeita!</p>
                        </>
                    ) : (
                        <>
                            <XCircle className="mx-auto text-red-400 mb-2" size={48} />
                            <h2 className="text-3xl font-black text-red-400">FALHA!</h2>
                            <p className="text-red-200 text-sm mt-1">A ordem estava incorreta.</p>
                        </>
                    )}
                </div>

                <div className="space-y-3">
                    {orderedPlayers.map((player, index) => {
                        const num = playerNumbers[player];
                        const prevNum = index > 0 ? playerNumbers[orderedPlayers[index-1]] : -1;
                        const isWrong = index > 0 && num < prevNum;

                        return (
                            <div key={player} className={`flex items-center p-3 rounded-xl border ${isWrong ? 'bg-red-900/30 border-red-500/50' : 'bg-slate-800 border-slate-700'}`}>
                                <div className="w-8 text-center font-bold text-slate-500 text-sm mr-2">#{index + 1}</div>
                                <div className="flex-1 font-bold text-white">{player}</div>
                                <div className={`px-3 py-1 rounded-lg font-black text-lg ${isWrong ? 'bg-red-500 text-white' : 'bg-yellow-400 text-black'}`}>
                                    {num}
                                </div>
                                {isWrong && <AlertCircle className="ml-2 text-red-400" size={20} />}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="p-6 bg-slate-900 border-t border-slate-800 z-40">
        {phase === 'init' && (
            <button onClick={startRound} className={`w-full ${mainThemeColor} text-black font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}>
                <Dices size={24} /> <span>SORTEAR NÚMEROS</span>
            </button>
        )}

        {phase === 'numbers' && (
            <button onClick={startOrdering} disabled={playersSeen.length < players.length} className={`w-full font-bold text-xl py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${playersSeen.length < players.length ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : `${mainThemeColor} text-black active:scale-95 animate-pulse`}`}>
                {playersSeen.length < players.length ? <span>AGUARDANDO ({playersSeen.length}/{players.length})</span> : <><span>IR PARA ORDENAÇÃO</span><ArrowRight size={24} /></>}
            </button>
        )}

        {phase === 'ordering' && (
             <button onClick={checkResult} className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <Check size={24} /> <span>CONFIRMAR ORDEM</span>
            </button>
        )}

        {phase === 'result' && (
             <button onClick={nextRound} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <RefreshCw size={24} /> <span>PRÓXIMA RODADA</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
