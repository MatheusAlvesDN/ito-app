import { Brain, Heart, Lightbulb, Briefcase, Flame } from 'lucide-react';

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
  },
  {
    id: 'trabalho',
    name: 'Trabalho & Dinheiro',
    description: 'Carreira, grana e cenários corporativos hilários.',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-900',
    icon: Briefcase,
    questions: [
      'O que eu faria primeiro se fosse demitido(a) hoje?',
      'Se eu abrisse um negócio próprio, sobre o que seria?',
      'Qual o motivo mais idiota pelo qual eu seria demitido(a)?',
      'Se eu tivesse que pedir dinheiro emprestado para alguém daqui, pra quem eu pediria?',
      'Em qual tipo de trabalho eu seria um completo desastre?',
      'Qual é a desculpa que eu mais uso para faltar em algum compromisso ou no trabalho?',
      'Eu sou a pessoa que paga a conta do bar ou a que some na hora de rachar?',
      'Se eu pudesse ser o chefe de qualquer empresa no mundo, qual seria?',
      'O que eu faria se descobrisse que meu colega ganha o dobro que eu para não fazer nada?',
      'Qual profissão infantil eu sonhava em ter e que passou muito longe da realidade?'
    ]
  },
  {
    id: 'polemicas',
    name: 'Polêmicas & Romance',
    description: 'Aviso: Pode acabar com amizades ou relacionamentos.',
    color: 'bg-purple-100',
    textColor: 'text-purple-900',
    icon: Flame,
    questions: [
      'Qual é o meu maior "red flag" em um encontro?',
      'O que é mais provável eu perdoar: uma traição ou uma mentira financeira?',
      'Eu voltaria com meu(minha) ex em alguma circunstância?',
      'Qual o meu tipo ideal em três palavras?',
      'O que eu faria se a pessoa que eu gosto me mandasse uma mensagem às 3 da manhã dizendo "estou na sua porta"?',
      'Eu sou do tipo que apaga todas as fotos do ex ou as mantém guardadas?',
      'Quem daqui do grupo tem mais chance de roubar o(a) parceiro(a) de alguém?',
      'Eu acredito que almas gêmeas existem ou isso é papo furado?',
      'Se eu tivesse que me casar amanhã de surpresa com uma pessoa famosa, quem seria?',
      'Qual a mentira mais óbvia que eu já contei num primeiro encontro?'
    ]
  }
];
