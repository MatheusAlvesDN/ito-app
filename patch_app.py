import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

search = """// Tela de Cadastro
const RegisterScreen = ({ onBack, onNext }: { onBack: () => void, onNext: (players: string[]) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    if (inputValue.trim()) {
      setLocalPlayers([...localPlayers, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><ChevronLeft size={24} className="text-slate-700" /></button>
        <span className="ml-4 font-bold text-lg text-slate-700">Quem vai jogar?</span>
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        <div className="bg-white p-4 rounded-3xl shadow-lg mb-6 border border-slate-100 shrink-0">
          <label className="block text-slate-500 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Adicionar Jogador</label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Nome do participante"
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
            <button onClick={addPlayer} disabled={!inputValue.trim()} className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl p-3 shadow-md transition-all active:scale-95">
              <Plus size={24} />
            </button>
          </div>
        </div>"""

replace = """// Componente isolado para o input, evita re-renderizar a tela toda a cada tecla digitada
const PlayerInput = ({ onAdd }: { onAdd: (name: string) => void }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="Nome do participante"
        className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
      />
      <button onClick={handleAdd} disabled={!inputValue.trim()} className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl p-3 shadow-md transition-all active:scale-95">
        <Plus size={24} />
      </button>
    </div>
  );
};

// Tela de Cadastro
const RegisterScreen = ({ onBack, onNext }: { onBack: () => void, onNext: (players: string[]) => void }) => {
  const [localPlayers, setLocalPlayers] = useState<string[]>([]);

  const addPlayer = (name: string) => {
    setLocalPlayers(prev => [...prev, name]);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative h-full">
      <div className="p-4 flex items-center bg-white shadow-sm sticky top-0 z-20 pt-8 md:pt-4 safe-top">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><ChevronLeft size={24} className="text-slate-700" /></button>
        <span className="ml-4 font-bold text-lg text-slate-700">Quem vai jogar?</span>
      </div>

      <div className="flex-1 p-6 flex flex-col max-w-full overflow-hidden">
        <div className="bg-white p-4 rounded-3xl shadow-lg mb-6 border border-slate-100 shrink-0">
          <label className="block text-slate-500 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Adicionar Jogador</label>
          <PlayerInput onAdd={addPlayer} />
        </div>"""

if search in content:
    with open('src/App.tsx', 'w') as f:
        f.write(content.replace(search, replace))
    print("Patched successfully")
else:
    print("Search string not found")
