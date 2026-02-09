import React from 'react';
import { Unlock, Star, Zap } from 'lucide-react';

// Definição do tipo Tema
export type Theme = {
  id: string;
  name: string;
  description: string;
  color: string;
  textColor: string;
  buttonColor: string; // Cor para botões dentro do tema
  icon: React.ElementType;
};

// Banco de Perguntas Simulado (DB)
export const QUESTIONS_DB: Record<string, string[]> = {
  classic: [
    "O quão útil seria este objeto em um apocalipse zumbi?",
    "O quão perigoso é este animal?",
    "Nível de popularidade desta celebridade.",
    "O quão difícil é esta profissão?",
    "O quão assustador é este filme?",
    "Nível de inteligência deste personagem fictício.",
    "Filmes do George Melies"
  ],
  anime: [
    "Melhores Cavaleiros de Ouro",
    "Cavaleiros de Bronze mais fortes ",
    "Armaduras mais bonitas de Saint Seiya",
    "Personagens mais injustiçados da obra",
    "Vilões mais memoráveis de Saint Seiya",
    "Melhores lutas dos animes",
    "Sagas de Saint Seiya",
    "Cavaleiros mais leais à Athena",
    "Personagens com o melhor desenvolvimento",
    "Momentos mais emocionantes dos animes",
    "Transformações mais impactantes de Dragon Ball",
    "Vilões mais ameaçadores",
    "Personagens mais fortes ",
    "Sagas de Dragon Ball",
    "Personagens mais desperdiçados pela história",
    "Lutas mais épicas de Dragon Ball Z e Super",
    "Personagens mais carismáticos",
    "Melhores treinamentos",
    "Treinamentos mais dificeis",
    "Mortes mais marcantes (e mais traumáticas)",
    "Melhores protagonistas dos animes",
    "Piores vilões já criados",
    "Personagens mais overpower dos animes",
    "Animes com as melhores trilhas sonoras",
    "Personagens mais inteligentes dos animes",
    "Animes que envelheceram bem",
    "Animes que envelheceram mal",
    "Personagens secundários que roubam a cena",
    "Animes com as melhores lutas",
    "Animes superestimados"
  ]
};

// Lista de Temas Disponíveis
export const THEMES: Theme[] = [
  { id: 'free', name: 'Livre', description: 'Sem perguntas definidas. Criem as suas!', color: 'bg-slate-200', textColor: 'text-slate-900', buttonColor: 'bg-slate-400 hover:bg-slate-300', icon: Unlock },
  { id: 'classic', name: 'Clássico', description: 'Perguntas variadas para todos os gostos.', color: 'bg-yellow-100', textColor: 'text-yellow-900', buttonColor: 'bg-yellow-400 hover:bg-yellow-300', icon: Star },
  { id: 'anime', name: 'Anime', description: 'Debates sobre Saint Seiya, Dragon Ball e mais!', color: 'bg-orange-100', textColor: 'text-orange-900', buttonColor: 'bg-orange-400 hover:bg-orange-300', icon: Zap },
];