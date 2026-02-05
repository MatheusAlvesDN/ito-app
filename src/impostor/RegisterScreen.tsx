import { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Ghost } from 'lucide-react';

type Props = {
  onBack: () => void;
  onNext: (players: string[]) => void;
};

export default function RegisterScreenImpostor({ onBack, onNext }: Props) {
  const [inputValue, setInputValue] = useState('');
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    const v = inputValue.trim();
    if (!v) return;
    setLocalPlayers((prev) => [...prev, v]);
    setInputValue('');
  };

  const removePlayer = (index: number) => {
    setLocalPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 relative h-full text-white">
      <div className="p-4 flex items-center bg-slate-900 shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top border-b border-slate-800">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors">
          <ChevronLeft size={24} className="text-purple-400" />
        </button>
        <span className="ml-4 font-bold text-lg text-white">Jogadores (Impostor)</span>
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        {/* Input Area */}
        <div className="bg-slate-800 p-4 rounded-3xl shadow-lg mb-6 border border-slate-700 shrink-0">
          <label className="block text-purple-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Novo Participante</label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Digite o nome"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button onClick={addPlayer} disabled={!inputValue.trim()} className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl p-3 shadow-md transition-all">
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {localPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <Ghost size={48} className="mb-2 opacity-50" />
              <p>Mínimo de 3 jogadores para este modo</p>
            </div>
          ) : (
            localPlayers.map((player, index) => (
              <div key={`${player}-${index}`} className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-700 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-200">{player}</span>
                </div>
                <button onClick={() => removePlayer(index)} className="p-2 text-slate-500 hover:text-red-400">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800 shrink-0 safe-bottom">
        <button
          onClick={() => onNext(localPlayers)}
          // REGRA IMPORTANTE: Impostor precisa de 3+
          disabled={localPlayers.length < 3}
          className="w-full bg-white hover:bg-slate-200 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>AVANÇAR</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
        {localPlayers.length > 0 && localPlayers.length < 3 && (
           <p className="text-center text-red-400 text-xs mt-3 font-bold">Precisa de pelo menos 3 jogadores</p>
        )}
      </div>
    </div>
  );
}