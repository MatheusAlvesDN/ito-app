# 🎮 PARTY GAMES - Mobile Experience

Uma plataforma premium de jogos de tabuleiro sociais (Party Games), projetada sob medida para dispositivos móveis. Com um visual sofisticado, interações táteis dinâmicas e transições fluidas, **Party Games** é o companheiro perfeito para animar encontros, festas e momentos entre amigos.

O aplicativo opera no modelo **Pass and Play** (um único celular que circula entre os jogadores), ideal para qualquer lugar e sem a necessidade de múltiplos aparelhos ou conexão à internet ativa após o carregamento.

---

## 🕹️ Modos de Jogo Inclusos

### 1. ⚡ ITO Clássico (Cooperativo)
Inspirado no aclamado jogo de cartas japonês, este modo exige sintonia e dedução do grupo.
- **Como funciona:** Cada jogador recebe um número secreto de **1 a 100**. Um tema/situação é sorteado (ex: *"O quão útil seria este objeto em um apocalipse zumbi?"*). Cada jogador deve dar uma resposta subjetiva condizente com seu número (1 para o menos útil, 100 para o mais útil).
- **O Desafio:** O grupo deve discutir e ordenar as cartas em ordem crescente de forma cooperativa, sem que ninguém revele o número exato diretamente.
- **Diferencial Técnico:** Interface de ordenação interativa com suporte total a gestos tarrastáveis (Drag and Drop) via `@dnd-kit` e linha do tempo de resultados interativa.

### 2. 👻 IMPOSTOR (Dedução e Blefe)
Um jogo de intriga, suspeitas e inteligência social para no mínimo 3 jogadores.
- **Como funciona:** A maioria dos jogadores recebe uma pergunta secreta idêntica (ex: *"Cães de Estimação"*), enquanto um deles (o Impostor sorteado) recebe uma pergunta sutilmente alterada (ex: *"Animais da Selva"*).
- **O Desafio:** Os jogadores fazem perguntas subjetivas entre si. O Impostor deve blefar e se integrar às respostas da maioria para não ser descoberto, enquanto o grupo honesto tenta farejar quem está deslocado do contexto real.
- **Diferencial Técnico:** Layout imersivo de revelação de papel com gradientes neons, cards de discussão estilo sala de bate-papo futurista e painel revelador de identidade.

### 3. 🔍 QUEM SOU EU? (Adivinhação Casual)
O clássico jogo da "carta na testa" adaptado digitalmente.
- **Como funciona:** Os participantes preparam as cartas na tela e o jogador da vez encosta o celular na testa sem olhar. Os demais visualizam qual personagem ele tirou (ex: *"Harry Potter"*, *"Darth Vader"* ou figuras históricas/populares).
- **O Desafio:** O jogador da vez faz perguntas de Sim/Não ou recebe dicas subjetivas do grupo para tentar descobrir sua própria identidade secreta.
- **Diferencial Técnico:** Telas de aviso anti-olhada ("Atenção: Não olhe para a tela!"), cards de personagem flutuantes com gradientes imersivos e controle tátil de acertos/pontuação fluida.

---

## 🎨 Design System e Estética Premium

O aplicativo foi completamente reformulado para proporcionar uma experiência **Premium e Moderna**:
- **Harmonia Visual:** Interface de alto contraste projetada em Slate-950 (fundo escuro profundo) com destaques e neon adaptativos para cada modo de jogo (Amarelo/Ouro para Clássico, Roxo/Violeta para Impostor e Esmeralda/Teal para Quem Sou Eu).
- **Tipografia Moderna:** Integração refinada do Google Fonts, utilizando as famílias **Outfit** (títulos marcantes e arrojados) e **Plus Jakarta Sans** (texto de leitura e botões com excelente ergonomia visual).
- **Efeito Glassmorphism:** Cabeçalhos, alertas e menus flutuantes implementados com desfoque de fundo inteligente (`backdrop-blur-md`) e bordas translúcidas finas, dando profundidade tridimensional.
- **Layout Responsivo Flex (`shrink-0`):** Nova arquitetura que bloqueia rolagens concorrentes indesejadas (`100dvh` / `overflow-hidden` global) e posiciona os botões principais de rodapé em layout flexível nativo. Isso assegura que **nenhum botão ou elemento seja cortado em smartphones menores** e as listas internas rolem de forma independente e leve.
- **Animações Fluidas:** Efeitos de flip de cartas 3D simuladas por CSS e movimentos suaves de entrada (`animate-fade-in` e `animate-float`) para feedbacks táteis naturais.

---

## 🛠️ Stack Tecnológica

O projeto foi construído usando tecnologias modernas focadas em performance e portabilidade mobile rápida:
1. **Core:** React 19 + TypeScript (tipagem estrita de estados de jogos e telas).
2. **Estilização:** Tailwind CSS v3 (layouts flexbox e grid avançados, efeitos de transição) + Vanilla CSS utilitário para animações e perspective 3D.
3. **Drag & Drop:** `@dnd-kit/core` e `@dnd-kit/sortable` para movimentação de jogadores com suporte a toque tátil e amortecimento de arrasto.
4. **Ícones:** `lucide-react` (ícones vetoriais modernos e dinâmicos).
5. **Vite:** Rolldown-Vite para build instantâneo e bundling de alta eficiência para web e mobile.
6. **Mobile Wrapper (Capacitor v8):** Conversão nativa simples para Android e iOS, aproveitando o código web diretamente com webview nativa otimizada de alta velocidade.

---

## 📱 Sincronização e Builds Nativos (Capacitor)

Para gerar e sincronizar os assets de produção com a pasta nativa do seu projeto mobile (Android/iOS), utilize os seguintes comandos no terminal a partir do diretório raiz:

1. **Gere os arquivos estáticos compilados para produção:**
   ```bash
   npm run build
   ```

2. **Sincronize a build com o Capacitor:**
   ```bash
   npx cap sync
   ```

3. **Abrir o projeto no Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Compilar a APK de testes direto pelo terminal (PowerShell):**
   ```bash
   cd android
   ./gradlew.bat assembleDebug
   ```
