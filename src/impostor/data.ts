import {
  Lightbulb,
  Star,
} from 'lucide-react';

// --- TIPOS ---

export type Theme = {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  textColor: string;
};

export type ImpostorScenario = {
  honest: string; // Pergunta que a maioria recebe
  impostorVariations: string[]; // Dica para o impostor
};


export const THEMES: Theme[] = [
  {
    id: 'free',
    name: 'Livre / Aleatório',
    description: 'Perguntas variadas para qualquer situação.',
    icon: Lightbulb,
    color: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  {
    id: 'pesado',
    name: 'Mente fria na hora do perigo',
    description: 'Aquele que olha por nós tarda e não falha',
    icon: Lightbulb,
    color: 'bg-red-100',
    textColor: 'text-red-700',
  },
  {
    id: 'geek',
    name: 'Geek & Cultura Pop',
    description: 'Filmes, jogos, heróis e tecnologia.',
    icon: Star,
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
];

// --- DADOS DO MODO IMPOSTOR ---

export const IMPOSTOR_SCENARIOS: Record<string, ImpostorScenario[]> = {
  // Cenários padrão 
  default: [
    {
      honest: 'Animais de Estimação',
      impostorVariations: ['Animais da Selva', 'Animais Marinhos', 'Insetos', 'Dinossauros'],
    },
    {
      honest: 'Esportes Olímpicos',
      impostorVariations: ['Jogos de Tabuleiro', 'Brincadeiras de Criança', 'Esports (Videogames)'],
    },
    {
      honest: 'Instrumentos Musicais',
      impostorVariations: ['Ferramentas de Construção', 'Utensílios de Cozinha', 'Material Escolar'],
    },
    {
      honest: 'Super-Heróis',
      impostorVariations: ['Vilões de Filmes', 'Deuses Gregos', 'Personagens de Desenho Animado'],
    },
  ],

  pesado: [
    {
      honest: 'Se você pudesse escolher uma pessoa para ser amarrada em uma cadeira e ser torturada por 24 horas, quem seria?',
      impostorVariations: ['quem é o cantor pop mais subestimado da atualidade?', 'Qual ator você acha que é o mais superestimado?', 'Qual personagem de desenho animado você acha mais irritante?'],
    },
    {
      honest: 'Se você fosse um ditador malvado e tivesse que escolher uma pessoa para ser jogada em um vulcão, quem seria?',
      impostorVariations: ['Escolha um dos jogadores presentes'],
    },
  ],



  geek: [
    {
      honest: 'Filmes da Marvel',
      impostorVariations: ['Filmes da DC', 'Filmes de Terror', 'Comédias Românticas'],
    },
    {
      honest: 'Personagens de Harry Potter',
      impostorVariations: ['Personagens de Senhor dos Anéis', 'Personagens de Star Wars', 'Personagens da Disney'],
    },
    {
      honest: 'Videogames Famosos',
      impostorVariations: ['Jogos de Celular ruins', 'Jogos de Tabuleiro Antigos', 'Esportes Reais'],
    },
  ],

};