import { ChevronLeft, Zap, Ghost, UserSearch, RefreshCw } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectClassic: () => void;
  onSelectImpostor: () => void;
  onSelectWhoAmI: () => void;
  onSelectWhatDoYouKnow: () => void;
  onSelectTranslator: () => void;
}

export function ModeSelectionScreen({
  onBack,
  onSelectClassic,
  onSelectImpostor,
  onSelectWhoAmI,
  onSelectWhatDoYouKnow,
  onSelectTranslator,
}: Props) {
  return (
    <div className="flex-1 flex flex-col bg-slate-955 relative h-full overflow-y-auto text-slate-100">
      {/* Header Fixo */}
      <div className="p-4 flex items-center bg-slate-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 pt-8 md:pt-4 safe-top shrink-0">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-200 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-black text-xl text-white font-outfit">Escolha o Modo</span>
      </div>

      {/* Área de conteúdo rolável */}
      <div className="p-6 flex flex-col gap-6 pb-12">
        {/* ITO Clássico */}
        <button
          onClick={onSelectClassic}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-yellow-500/20 hover:border-yellow-400/80 hover:bg-yellow-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={120} className="text-yellow-400 fill-yellow-400" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-yellow-400 mb-2">
              <Zap size={24} />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white font-outfit">ITO Clássico</h3>
              <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">
                Coop
              </span>
            </div>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Cooperação total. Ordene os números da sua equipe de forma crescente sem falar o valor direto!
            </p>
          </div>
        </button>

        {/* Impostor */}
        <button
          onClick={onSelectImpostor}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-purple-500/20 hover:border-purple-400/80 hover:bg-purple-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Ghost size={120} className="text-purple-400 fill-purple-400" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="w-12 h-12 bg-purple-400/10 border border-purple-400/20 rounded-2xl flex items-center justify-center text-purple-400 mb-2">
              <Ghost size={24} />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white font-outfit">IMPOSTOR</h3>
              <span className="bg-purple-400/10 border border-purple-400/30 text-purple-300 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">
                Bluff
              </span>
            </div>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Um traidor entre nós. Todos recebem a mesma pergunta, exceto o Impostor. Quem será que está blefando?
            </p>
            <div className="inline-block w-fit bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-xl text-[11px] text-purple-200 mt-2 font-bold font-outfit">
              Mínimo 3 Jogadores
            </div>
          </div>
        </button>

        {/* Quem Sou Eu */}
        <button
          onClick={onSelectWhoAmI}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-emerald-500/20 hover:border-emerald-400/80 hover:bg-emerald-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserSearch size={120} className="text-emerald-400 fill-emerald-400" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="w-12 h-12 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-2">
              <UserSearch size={24} />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white font-outfit">QUEM SOU EU?</h3>
              <span className="bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">
                Casual
              </span>
            </div>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Coloque o celular na testa! Você é o único jogador do grupo que não sabe quem é seu próprio personagem.
            </p>
            <div className="inline-block w-fit bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 rounded-xl text-[11px] text-emerald-200 mt-2 font-bold font-outfit">
              Mínimo 2 Jogadores
            </div>
          </div>
        </button>

        {/* O Que Você Sabe? */}
        <button
          onClick={onSelectWhatDoYouKnow}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-rose-500/20 hover:border-rose-400/80 hover:bg-rose-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserSearch size={120} className="text-rose-400 fill-rose-400" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="w-12 h-12 bg-rose-400/10 border border-rose-400/20 rounded-2xl flex items-center justify-center text-rose-400 mb-2">
              <UserSearch size={24} />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white font-outfit">O QUE VOCÊ SABE?</h3>
              <span className="bg-rose-400/10 border border-rose-400/30 text-rose-300 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">
                Party
              </span>
            </div>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Mostre que você conhece seus amigos! Alguém responde uma pergunta e os outros tentam adivinhar qual foi a resposta.
            </p>
            <div className="inline-block w-fit bg-rose-950/40 border border-rose-500/20 px-3 py-1 rounded-xl text-[11px] text-rose-200 mt-2 font-bold font-outfit">
              Mínimo 3 Jogadores
            </div>
          </div>
        </button>

        {/* Tradutor em Cadeia */}
        <button
          onClick={onSelectTranslator}
          className="group relative w-full bg-slate-900/40 p-8 rounded-3xl shadow-xl border-2 border-indigo-500/20 hover:border-indigo-400/80 hover:bg-indigo-500/[0.02] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <RefreshCw size={120} className="text-indigo-400 fill-indigo-400/10" />
          </div>
          <div className="relative z-10 flex flex-col gap-2">
            <div className="w-12 h-12 bg-indigo-400/10 border border-indigo-400/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-2">
              <RefreshCw size={24} />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white font-outfit">Lab de Tradução</h3>
              <span className="bg-indigo-400/10 border border-indigo-400/30 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full text-xs font-outfit">
                Lab
              </span>
            </div>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Experimento de telefone sem fio linguístico. Traduza um texto em inglês por vários idiomas e veja o resultado final em português!
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
