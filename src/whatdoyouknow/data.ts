import { Brain, Heart, Lightbulb, Compass } from 'lucide-react';

export type WhatDoYouKnowTheme = {
  id: string;
  name: string;
  description: string;
  color: string;
  textColor: string;
  icon: React.ElementType;
  questions: string[];
};

export const WHATDOYOUKNOW_THEMES: WhatDoYouKnowTheme[] = [
  {
    id: 'pessoal',
    name: 'Pessoal & Curiosidades',
    description: 'Perguntas sobre gostos, medos e desejos pessoais.',
    color: 'bg-rose-100',
    textColor: 'text-rose-900',
    icon: Heart,
    questions: [
      'Qual é o meu maior medo irracional?',
      'Se eu pudesse comer apenas uma comida para o resto da vida, qual seria?',
      'Qual foi a coisa mais embaraçosa que já me aconteceu?',
      'Qual é o meu talento inútil?',
      'Se eu ganhasse na loteria hoje, qual seria a primeira coisa que eu compraria?',
      'Qual é a minha série ou filme de conforto (que vejo repetidamente)?',
      'Qual é a minha pior mania?',
      'Qual é o meu animal favorito?',
      'Qual lugar no mundo eu mais tenho vontade de conhecer?',
      'Qual palavra ou expressão eu falo o tempo todo?',
      'Qual foi a última coisa que eu pesquisei no Google?',
      'Se eu pudesse ter um superpoder, qual escolheria?',
      'Quem é meu "crush" famoso(a)?',
      'Preferia viver sem música ou sem internet?',
      'Qual a minha opinião mais polêmica sobre comida?'
    ]
  },
  {
    id: 'imaginacao',
    name: 'E se...?',
    description: 'Situações hipotéticas e decisões difíceis.',
    color: 'bg-blue-100',
    textColor: 'text-blue-900',
    icon: Lightbulb,
    questions: [
      'Se houvesse um apocalipse zumbi, quanto tempo eu duraria?',
      'Se eu fosse preso, pelo que seria?',
      'Se eu tivesse que participar de um reality show, qual seria?',
      'Se fizessem um filme sobre a minha vida, que ator/atriz me interpretaria?',
      'Se eu pudesse viajar no tempo, para qual época eu iria?',
      'Se eu encontrasse um gênio da lâmpada, quais seriam meus 3 desejos?',
      'Se eu pudesse ser qualquer animal por um dia, qual eu seria?',
      'Se eu tivesse que usar apenas uma cor de roupa para o resto da vida, qual seria?',
      'Se eu fosse obrigado a morar no meio do mato ou numa cidade caótica, qual escolheria?',
      'Se eu pudesse jantar com qualquer figura histórica, quem seria?'
    ]
  },
  {
    id: 'amigos',
    name: 'Amizade & Convivência',
    description: 'O que o grupo pensa sobre o jogador.',
    color: 'bg-emerald-100',
    textColor: 'text-emerald-900',
    icon: Brain,
    questions: [
      'O que eu mais faço quando estou estressado?',
      'Sou a pessoa que resolve o problema ou a que entra em pânico?',
      'O que é mais provável eu fazer numa festa: dançar no meio da roda ou ficar no canto mexendo no celular?',
      'Qual é o assunto sobre o qual eu posso falar sem parar por uma hora?',
      'O que me deixa com raiva mais rápido do que qualquer outra coisa?',
      'Eu sou do tipo que chega 15 minutos adiantado ou 15 minutos atrasado?',
      'Se eu desaparecesse do nada, onde vocês apostariam que eu estaria?',
      'Sou melhor guardando segredos ou contando fofocas?',
      'Qual é a primeira coisa que eu noto em uma pessoa?',
      'Quantos alarmes eu preciso para acordar de manhã?'
    ]
  }
];
