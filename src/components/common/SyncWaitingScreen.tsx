import { RefreshCw } from 'lucide-react';
import type { AccentColor } from './PlayerRegistrationScreen';

interface Props {
  title?: string;
  message?: string;
  accentColor?: AccentColor;
}

const COLOR_MAP: Record<AccentColor, { glow: string; text: string }> = {
  yellow: { glow: 'bg-yellow-600/10', text: 'text-yellow-400' },
  purple: { glow: 'bg-purple-600/10', text: 'text-purple-400' },
  emerald: { glow: 'bg-emerald-600/10', text: 'text-emerald-400' },
  rose: { glow: 'bg-rose-600/10', text: 'text-rose-400' },
};

export function SyncWaitingScreen({
  title = 'Sincronizando Temas...',
  message = 'O líder da sala está escolhendo os temas do jogo. Prepare-se!',
  accentColor = 'yellow',
}: Props) {
  const colors = COLOR_MAP[accentColor] || COLOR_MAP.yellow;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-955 text-center text-slate-100 font-sans relative overflow-hidden h-full">
      <div className={`absolute top-0 right-0 w-96 h-96 ${colors.glow} rounded-full blur-[120px] pointer-events-none`} />
      <div className="mb-6 relative">
        <div className={`absolute inset-0 ${colors.glow} blur-xl rounded-full`} />
        <div
          className="bg-slate-900 border border-white/5 p-6 rounded-full shadow-2xl relative z-10 animate-spin"
          style={{ animationDuration: '3s' }}
        >
          <RefreshCw size={48} className={colors.text} />
        </div>
      </div>
      <h2 className="text-2xl font-black text-white mb-2 font-outfit">{title}</h2>
      <p className="text-slate-400 max-w-xs text-sm font-medium leading-relaxed animate-pulse">
        {message}
      </p>
    </div>
  );
}
