import React from 'react';
import { Trash2, Users } from 'lucide-react';

interface PlayerListProps {
  players: string[];
  onRemove: (index: number) => void;
}

const PlayerList = React.memo(({ players, onRemove }: PlayerListProps) => {
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-slate-300">
        <Users size={48} className="mb-2 opacity-50" />
        <p>Adicione pelo menos 2 jogadores</p>
      </div>
    );
  }

  return (
    <>
      {players.map((player, index) => (
        <div key={index} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold shadow-sm">
              {player.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-slate-700 truncate max-w-[150px]">{player}</span>
          </div>
          <button onClick={() => onRemove(index)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </>
  );
});

export default PlayerList;
