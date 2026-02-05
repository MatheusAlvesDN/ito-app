import { useState } from 'react';
import { ChevronLeft, Plus, Trash2, Users } from 'lucide-react';

type Props = {
  onBack: () => void;
  onNext: (players: string[]) => void;
};

export default function RegisterScreenClassic({ onBack, onNext }: Props) {
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
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <span className="ml-4 font-bold text-lg text-slate-700">Jogadores (Clássico)</span>
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        {/* Input Area */}
        <div className="bg-white p-4 rounded-3xl shadow-lg mb-6 border border-slate-100 shrink-0">
          <label className="block text-slate-500 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Novo Participante</label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Digite o nome"
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
            <button onClick={addPlayer} disabled={!inputValue.trim()} className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-slate-200 text-black rounded-xl p-3 shadow-md transition-all">
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {localPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-300">
              <Users size={48} className="mb-2 opacity-50" />
              <p>Mínimo de 2 jogadores</p>
            </div>
          ) : (
            localPlayers.map((player, index) => (
              <div key={`${player}-${index}`} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold">
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700">{player}</span>
                </div>
                <button onClick={() => removePlayer(index)} className="p-2 text-slate-300 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shrink-0 safe-bottom">
        <button
          onClick={() => onNext(localPlayers)}
          disabled={localPlayers.length < 2}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>AVANÇAR</span> <ChevronLeft className="rotate-180" size={24} />
        </button>
      </div>
    </div>
  );
}