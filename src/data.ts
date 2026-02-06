import React from 'react';
import { Unlock, Star, Zap } from 'lucide-react';

// Definição do tipo Tema
export type Theme = {
  id: string;
  name: string;
  description: string;
  color: string;
  textColor: string;
  buttonColor?  : string; // Cor para botões dentro do tema
  icon: React.ElementType;
};

// Lista de Temas Disponíveis
export const THEMES: Theme[] = [
  { id: 'free', name: 'Livre', description: 'Sem perguntas definidas. Criem as suas!', color: 'bg-slate-200', textColor: 'text-slate-900', buttonColor: 'bg-slate-400 hover:bg-slate-300', icon: Unlock },
  { id: 'classic', name: 'Clássico', description: 'Perguntas variadas para todos os gostos.', color: 'bg-yellow-100', textColor: 'text-yellow-900', buttonColor: 'bg-yellow-400 hover:bg-yellow-300', icon: Star },
  { id: 'anime', name: 'Anime', description: 'Debates sobre Saint Seiya, Dragon Ball e mais!', color: 'bg-orange-100', textColor: 'text-orange-900', buttonColor: 'bg-orange-400 hover:bg-orange-300', icon: Zap },
  
];
