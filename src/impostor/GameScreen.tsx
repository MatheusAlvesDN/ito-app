import { useState, useEffect} from 'react';
import {
  ChevronLeft,
  EyeOff,
  Ghost,
  Users,
  RefreshCw,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { type Theme } from '../data';

// --- TIPOS E DADOS LOCAIS ---

// Estrutura para as perguntas do modo Impostor
type ImpostorScenario = {
  honest: string; // Pergunta que a maioria recebe
  impostorVariations: string[]; // Lista de variações para o impostor
};

// Banco de dados de cenários mapeados por ID do tema
// Você pode expandir isso ou mover para o data.ts futuramente
const IMPOSTOR_SCENARIOS: Record<string, ImpostorScenario[]> = {
  default: [
    {
      honest: 'Comida de Café da Manhã',
      impostorVariations: ['Comida de Jantar', 'Sobremesas', 'Lanches de Cinema'],
    },
    {
      honest: 'Animais de Estimação',
      impostorVariations: ['Animais da Selva', 'Animais Marinhos', 'Insetos'],
    },
  ],
  // Exemplo: Se o ID do tema for 'food'
  food: [
    {
      honest: 'Ingredientes de Pizza',
      impostorVariations: ['Ingredientes de Hambúrguer', 'Recheios de Pastel', 'Sabores de Sorvete'],
    },
    {
      honest: 'Pratos Italianos',
      impostorVariations: ['Pratos Japoneses', 'Pratos Mexicanos', 'Fast Food'],
    },
  ],
  // Adicione mais mapeamentos conforme os IDs do seu data.ts (ex: 'work', 'love', etc)
  adult: [
    {
      honest: 'Lugar para um primeiro encontro',
      impostorVariations: ['Lugar para terminar o namoro', 'Lugar para uma festa selvagem', 'Lugar para meditar'],
    },
  ],
};

type GameStep = 'distribution' | 'discussion' | 'reveal';

type Props = {
  onBack: () => void;
  players: string[];
  themes: Theme[];
};

export default function GameScreenImpostor({ onBack, players, themes }: Props) {
  // --- ESTADOS DO JOGO ---
  const [step, setStep] = useState<GameStep>('distribution');
  const [roundKey, setRoundKey] = useState(0); // Para forçar reset total

  // Dados da rodada atual
  const [impostorIndex, setImpostorIndex] = useState<number>(-1);
  const [honestQuestion, setHonestQuestion] = useState<string>('');
  const [impostorQuestion, setImpostorQuestion] = useState<string>('');
  
  // Controle de distribuição (passar o celular)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCardRevealed, setIsCardRevealed] = useState(false);

  // --- LÓGICA DE INICIALIZAÇÃO ---

  // Função para pegar cenários baseados nos temas selecionados
  const getScenarios = () => {
    let pool: ImpostorScenario[] = [...IMPOSTOR_SCENARIOS['default']];
    
    themes.forEach((t) => {
      if (IMPOSTOR_SCENARIOS[t.id]) {
        pool = [...pool, ...IMPOSTOR_SCENARIOS[t.id]];
      }
    });
    return pool;
  };

  const setupRound = () => {
    // 1. Validar jogadores
    if (players.length < 3) return;

    // 2. Sortear Impostor
    const newImpostorIndex = Math.floor(Math.random() * players.length);
    setImpostorIndex(newImpostorIndex);

    // 3. Sortear Perguntas
    const scenarios = getScenarios();
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    const honestQ = randomScenario.honest;
    // Sorteia uma das variações do impostor
    const impostorQ = randomScenario.impostorVariations[
      Math.floor(Math.random() * randomScenario.impostorVariations.length)
    ];

    setHonestQuestion(honestQ);
    setImpostorQuestion(impostorQ);

    // 4. Resetar estados
    setStep('distribution');
    setCurrentPlayerIndex(0);
    setIsCardRevealed(false);
  };

  // Inicia a primeira rodada ao montar
  useEffect(() => {
    setupRound();
  }, [roundKey]);

  // --- HANDLERS ---

  const handleNextPlayer = () => {
    setIsCardRevealed(false);
    if (currentPlayerIndex < players.length - 1) {
      // Passa para o próximo
      setCurrentPlayerIndex((prev) => prev + 1);
    } else {
      // Todos viram, vai para discussão
      setStep('discussion');
    }
  };

  const handleNewRound = () => {
    setRoundKey((k) => k + 1);
  };

  // --- RENDERIZAÇÃO DE ERRO (POUCOS JOGADORES) ---
  if (players.length < 3) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
        <div className="bg-red-100 p-6 rounded-full mb-4">
          <AlertTriangle size={48} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Jogadores Insuficientes</h2>
        <p className="text-slate-600 mb-6">O modo Impostor precisa de no mínimo 3 pessoas para funcionar.</p>
        <button
          onClick={onBack}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold"
        >
          Voltar
        </button>
      </div>
    );
  }

  // --- RENDERIZAÇÃO: FASE 1 - DISTRIBUIÇÃO ---
  if (step === 'distribution') {
    const currentPlayerName = players[currentPlayerIndex];
    const isImpostor = currentPlayerIndex === impostorIndex;
    const questionToShow = isImpostor ? impostorQuestion : honestQuestion;

    return (
      <div className="flex-1 flex flex-col bg-slate-900 relative">
        {/* Header Seguro */}
        <div className="p-4 pt-8 safe-top flex items-center justify-between">
          <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-end">
             <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Distribuição</span>
             <span className="text-white font-bold">
               {currentPlayerIndex + 1} de {players.length}
             </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-6 items-center justify-center">
          
          <div className="mb-8 text-center">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Passe o celular para</p>
            <h1 className="text-4xl font-black text-white">{currentPlayerName}</h1>
          </div>

          <div className="w-full max-w-sm aspect-[3/4] relative perspective-1000">
            {/* CARD INTERATIVO */}
            <div 
              className={`w-full h-full relative transition-all duration-500 transform-style-3d bg-slate-800 rounded-3xl border-4 ${
                isCardRevealed 
                  ? (isImpostor ? 'border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)]' : 'border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.3)]') 
                  : 'border-slate-700 shadow-xl'
              }`}
            >
              {!isCardRevealed ? (
                 // Lado FECHADO
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-slate-700/50 p-6 rounded-full mb-6 animate-pulse">
                    <EyeOff size={64} className="text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Toque para ver</h3>
                  <p className="text-slate-400">Garanta que ninguém mais está olhando!</p>
                  <button 
                    onClick={() => setIsCardRevealed(true)}
                    className="absolute inset-0 w-full h-full z-10" // Overlay click area
                    aria-label="Revelar carta"
                  />
                </div>
              ) : (
                // Lado ABERTO (Conteúdo)
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-slate-800 rounded-3xl overflow-hidden">
                   {/* Background Icon Watermark */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                      {isImpostor ? <Ghost size={300} /> : <Users size={300} />}
                   </div>

                   <div className="z-10 relative">
                      <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full mb-6 text-sm font-bold uppercase tracking-wider ${
                        isImpostor ? 'bg-purple-500/20 text-purple-300' : 'bg-yellow-400/20 text-yellow-300'
                      }`}>
                        {isImpostor ? <><Ghost size={16}/> Seu Papel</> : <><Users size={16}/> Seu Papel</>}
                      </div>
                      
                      <h2 className="text-3xl font-black text-white leading-tight mb-4">
                        {questionToShow}
                      </h2>
                      
                      {isImpostor ? (
                         <p className="text-purple-300 text-sm font-medium bg-purple-900/40 p-3 rounded-lg border border-purple-500/30">
                           Você é o Impostor! Tente agir como se tivesse a pergunta dos outros.
                         </p>
                      ) : (
                         <p className="text-yellow-200/80 text-sm font-medium">
                           Encontre quem tem uma pergunta diferente da sua.
                         </p>
                      )}
                   </div>

                   <button 
                     onClick={() => setIsCardRevealed(false)} // Esconde para passar
                     className="absolute bottom-6 left-6 right-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 z-20"
                   >
                     <EyeOff size={20} /> Esconder
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botão Próximo (Só aparece se estiver escondido para evitar clique acidental) */}
        {!isCardRevealed && (
          <div className="p-6 bg-slate-900 safe-bottom">
             <button
               onClick={handleNextPlayer}
               className="w-full bg-white text-slate-900 font-bold text-xl py-4 rounded-2xl shadow-lg hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               {currentPlayerIndex === players.length - 1 ? (
                 <>INICIAR DISCUSSÃO <MessageCircle size={24} /></>
               ) : (
                 <>PRÓXIMO JOGADOR <ArrowRight size={24} /></>
               )}
             </button>
          </div>
        )}
      </div>
    );
  }

  // --- RENDERIZAÇÃO: FASE 2 - DISCUSSÃO ---
  if (step === 'discussion') {
    return (
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-yellow-100 p-8 rounded-full mb-8 animate-bounce" style={{ animationDuration: '3s' }}>
            <MessageCircle size={80} className="text-yellow-600 fill-yellow-600" />
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-4">Hora de Debater!</h1>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 max-w-sm w-full space-y-4">
             <p className="text-slate-600 text-lg leading-relaxed">
               Façam perguntas uns aos outros sobre o tema secreto.
             </p>
             <div className="h-px bg-slate-100 w-full" />
             <p className="text-slate-500 text-sm">
               <strong className="text-slate-800">Objetivo:</strong> Descobrir quem recebeu a pergunta diferente (o Impostor).
             </p>
             <p className="text-slate-500 text-sm">
               <strong className="text-slate-800">Impostor:</strong> Tente se misturar e adivinhar a pergunta da maioria.
             </p>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100 safe-bottom">
           <button
             onClick={() => setStep('reveal')}
             className="w-full bg-slate-900 text-white font-bold text-xl py-4 rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"
           >
             REVELAR IDENTIDADE
           </button>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO: FASE 3 - REVELAÇÃO ---
  if (step === 'reveal') {
    const impostorName = players[impostorIndex];

    return (
      <div className="flex-1 flex flex-col bg-slate-900 text-white relative overflow-hidden">
        {/* Confetti effect placeholder or background graphic */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <Ghost size={400} className="absolute -right-20 -top-20 text-purple-500 rotate-12" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-6">O Impostor era</p>
          
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-40 rounded-full animate-pulse" />
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-slate-800">
               <span className="text-6xl font-black text-white">{impostorName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-purple-500 px-4 py-1 rounded-full whitespace-nowrap z-20">
               <span className="font-bold text-purple-300">{impostorName}</span>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4">
             {/* Card da Maioria */}
             <div className="bg-slate-800/80 p-4 rounded-xl border-l-4 border-yellow-400 text-left backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                   <Users size={16} className="text-yellow-400" />
                   <span className="text-xs font-bold text-slate-400 uppercase">Pergunta da Maioria</span>
                </div>
                <p className="text-xl font-bold text-white">{honestQuestion}</p>
             </div>

             {/* Card do Impostor */}
             <div className="bg-slate-800/80 p-4 rounded-xl border-l-4 border-purple-500 text-left backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                   <Ghost size={16} className="text-purple-400" />
                   <span className="text-xs font-bold text-slate-400 uppercase">Pergunta do Impostor</span>
                </div>
                <p className="text-xl font-bold text-white">{impostorQuestion}</p>
             </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800 safe-bottom flex flex-col gap-3">
           <button
             onClick={handleNewRound}
             className="w-full bg-yellow-400 text-black font-black text-xl py-4 rounded-2xl shadow-[0_4px_0_rgb(161,98,7)] active:shadow-none hover:translate-y-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
           >
             <RefreshCw size={24} /> JOGAR NOVAMENTE
           </button>
           <button
             onClick={onBack}
             className="w-full bg-transparent text-slate-400 font-bold py-4 rounded-2xl hover:text-white transition-colors"
           >
             Sair para o Menu
           </button>
        </div>
      </div>
    );
  }

  return null;
}