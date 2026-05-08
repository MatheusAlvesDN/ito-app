import { Crown, Film, Gamepad2, Stars } from 'lucide-react';

export type WhoAmITheme = {
  id: string;
  name: string;
  description: string;
  color: string;
  textColor: string;
  icon: React.ElementType;
  personalities: string[];
};

export const WHOAMI_THEMES: WhoAmITheme[] = [
  {
    id: 'historico',
    name: 'Personagens Históricos',
    description: 'Deuses da história, inventores e líderes.',
    color: 'bg-amber-100',
    textColor: 'text-amber-900',
    icon: Crown,
    personalities: ['Albert Einstein', 'Cleópatra', 'Júlio César', 'Monalisa', 'Santos Dumont', 'Napoleão Bonaparte', 'Tiradentes', 'Machado de Assis']
  },
  {
    id: 'cultura-pop',
    name: 'Cultura Pop & Famosos',
    description: 'Atores, cantores, influencers e celebridades.',
    color: 'bg-pink-100',
    textColor: 'text-pink-900',
    icon: Stars,
    personalities: ['Silvio Santos', 'Faustão', 'Michael Jackson', 'Xuxa', 'Madonna', 'Beyoncé', 'Gugu', 'Ana Maria Braga', 'Rihanna', 'Will Smith']
  },
  {
    id: 'geek',
    name: 'Geek & Super-Heróis',
    description: 'Universo dos quadrinhos, animes e games.',
    color: 'bg-indigo-100',
    textColor: 'text-indigo-900',
    icon: Gamepad2,
    personalities: ['Homem-Aranha', 'Batman', 'Coringa', 'Super Mario', 'Goku', 'Naruto', 'Darth Vader', 'Wolverine', 'Pikachu', 'Mestre Yoda']
  },
  {
    id: 'ficcao',
    name: 'Filmes & Séries',
    description: 'Personagens icônicos do cinema e TV.',
    color: 'bg-slate-200',
    textColor: 'text-slate-900',
    icon: Film,
    personalities: ['Harry Potter', 'Sherlock Holmes', 'Jack Sparrow', 'James Bond', 'Homer Simpson', 'Chaves', 'Seu Madruga', 'Bob Esponja', 'Barbie']
  },
];
