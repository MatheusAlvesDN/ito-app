import { Play, Cloud } from 'lucide-react';

interface Props {
  onPlay: () => void;
}

export function HomeScreen({ onPlay }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 relative overflow-hidden h-full">
      {/* Background blobs com glow de vidro (Glassmorphism) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] animate-float-medium pointer-events-none" />

      <div className="absolute top-12 left-6 opacity-30 animate-float-slow pointer-events-none">
        <Cloud size={80} className="text-sky-300 fill-sky-300/10 drop-shadow-sm" />
      </div>
      <div className="absolute top-32 right-8 opacity-20 animate-float-medium pointer-events-none">
        <Cloud size={100} className="text-purple-300 fill-purple-300/10 drop-shadow-sm" />
      </div>

      <div className="z-10 flex flex-col items-center mb-16 animate-fade-in-scale">
        <div className="mb-4 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
          <p className="text-indigo-200 font-bold tracking-[0.2em] text-xs uppercase font-outfit">
            Party Games Experience
          </p>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-2xl select-none text-center leading-none font-outfit">
          PARTY<br />
          <span className="text-yellow-400">GAMES</span>
        </h1>
        <p className="text-slate-400 mt-4 text-center max-w-xs font-medium text-sm">
          A melhor experiência de jogos de tabuleiro em grupo na tela do seu celular!
        </p>
      </div>

      <div className="z-10 w-full max-w-xs animate-fade-in">
        <button
          onClick={onPlay}
          className="group w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 active:from-yellow-500 active:to-amber-600 text-black font-black text-2xl py-5 rounded-3xl shadow-[0_8px_0_rgb(180,83,9)] hover:shadow-[0_6px_0_rgb(180,83,9)] active:shadow-none transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-2 flex items-center justify-center gap-3 border border-yellow-300/50 font-outfit"
        >
          <Play className="w-6 h-6 fill-black" />
          <span>JOGAR AGORA</span>
        </button>
      </div>
    </div>
  );
}
