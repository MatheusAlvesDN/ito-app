import { ChevronLeft, Smartphone, Wifi } from 'lucide-react';
import type { GameMode } from '../../App';

export const ConnectionSelectionScreen = ({
  onBack,
  onSelectLocal,
  onSelectMultiplayer,
  gameMode,
}: {
  onBack: () => void;
  onSelectLocal: () => void;
  onSelectMultiplayer: () => void;
  gameMode?: GameMode;
}) => {
  const getThemeColor = () => {
    if (gameMode === 'impostor') return 'text-purple-400 border-purple-500/20 hover:border-purple-400/85 hover:bg-purple-500/[0.02]';
    if (gameMode === 'classic') return 'text-yellow-450 border-yellow-500/20 hover:border-yellow-400/85 hover:bg-yellow-500/[0.02]';
    if (gameMode === 'whoami') return 'text-emerald-400 border-emerald-500/20 hover:border-emerald-400/85 hover:bg-emerald-500/[0.02]';
    return 'text-indigo-400 border-indigo-500/30 hover:border-indigo-400/80 hover:bg-indigo-500/[0.03]';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 relative h-full overflow-hidden text-slate-100">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-800/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Escolha a Conexão</span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center gap-6 max-w-md mx-auto w-full">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-black text-white font-outfit tracking-tight">Como querem jogar?</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Escolha jogar passando o aparelho ou com múltiplos dispositivos.</p>
        </div>

        {/* Local: Passa e Joga */}
        <button
          onClick={onSelectLocal}
          className="group relative w-full bg-slate-900/40 p-6 rounded-3xl border-2 border-slate-850 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-4 bg-slate-850 border border-slate-750 rounded-2xl text-slate-350 shrink-0">
              <Smartphone size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-outfit flex items-center gap-2">
                1 Celular <span className="bg-slate-800 text-slate-350 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Pass & Play</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-medium">Todos jogam na mesma tela, passando o celular a cada rodada. Ideal para qualquer momento.</p>
            </div>
          </div>
        </button>

        {/* Multiplayer: Vários Celulares */}
        <button
          onClick={onSelectMultiplayer}
          className={`group relative w-full bg-slate-900/40 p-6 rounded-3xl border-2 ${getThemeColor()} transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden shadow-lg`}
        >
          <div className="flex items-start gap-4">
            <div className="p-4 bg-slate-850 border border-slate-750 rounded-2xl text-slate-350 shrink-0">
              <Wifi size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-outfit flex items-center gap-2">
                Vários Celulares <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-550/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">Sem Fio</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed font-medium">Cada jogador usa seu próprio aparelho conectado na mesma rede local/Wi-Fi. Muito mais prático!</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
