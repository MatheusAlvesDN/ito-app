export async function callGeminiAPI(prompt: string, apiKey: string): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro na API do Gemini: ${response.status} - ${errorText || 'Sem detalhes'}`);
  }

  const result = await response.json();
  const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) {
    throw new Error('A resposta do Gemini veio vazia ou em formato inesperado.');
  }

  try {
    return JSON.parse(textResponse.trim());
  } catch (err) {
    console.error('Falha ao parsear resposta do Gemini:', textResponse, err);
    throw new Error('Falha ao interpretar a resposta em formato JSON do Gemini.');
  }
}

export async function generateItoTheme(promptInput: string, apiKey: string) {
  const prompt = `Você é um gerador de temas para o jogo party game ITO. 
No ITO clássico, cada jogador recebe um número secreto de 1 a 100. Eles devem dar dicas de acordo com o tema selecionado para representar a intensidade do seu número (1 é o menor/pior/mais fraco, 100 é o maior/melhor/mais forte).
Gere um tema baseado no seguinte conceito fornecido pelo usuário: "${promptInput}".
Retorne OBRIGATORIAMENTE um objeto JSON com o formato exato:
{
  "name": "Nome curto do tema (máx 24 caracteres)",
  "description": "Breve descrição (máx 60 caracteres)",
  "questions": [
    "Lista de 8 a 12 perguntas/desafios subjetivos e engraçados adequados para ordenar de 1 a 100 (ex: 'O quão perigoso é...', 'Nível de chatice de...', 'Útil numa ilha deserta', etc.)"
  ]
}`;
  return callGeminiAPI(prompt, apiKey);
}

export async function generateWhoAmITheme(promptInput: string, apiKey: string) {
  const prompt = `Você é um gerador de temas para o jogo "Quem Sou Eu?" (Who Am I). 
Cada jogador tenta adivinhar qual celebridade, personagem, profissão, objeto ou animal é, fazendo perguntas para o grupo.
Gere um tema baseado no seguinte conceito fornecido pelo usuário: "${promptInput}".
Retorne OBRIGATORIAMENTE um objeto JSON com o formato exato:
{
  "name": "Nome curto do tema (ex: Desenhos dos anos 90, Deuses Mitológicos - máx 24 caracteres)",
  "description": "Breve descrição do tema (máx 60 caracteres)",
  "personalities": [
    "Lista de 15 a 25 personalidades, famosos, personagens fictícios, ou coisas conhecidas que se encaixem perfeitamente nesse tema."
  ]
}`;
  return callGeminiAPI(prompt, apiKey);
}

export async function generateImpostorTheme(promptInput: string, apiKey: string) {
  const prompt = `Você é um gerador de temas para o jogo "Impostor" (estilo Spyfall/Undercover).
Neste jogo, a maioria dos jogadores recebe uma palavra secreta idêntica (Cesta dos Honestos), mas um jogador recebe uma palavra sutilmente diferente (Cesta do Impostor).
Gere um tema baseado no seguinte conceito fornecido pelo usuário: "${promptInput}".
Retorne OBRIGATORIAMENTE um objeto JSON com o formato exato:
{
  "name": "Nome curto do tema (máx 24 caracteres)",
  "description": "Breve descrição (ex: 'Cuidado com os falsos cognatos' - máx 60 caracteres)",
  "scenarios": [
    {
      "honest": "Palavra/conceito para o jogador honesto (ex: 'Teatro')",
      "impostor": "Palavra/conceito sutilmente diferente para o impostor (ex: 'Cinema')"
    },
    {
      "honest": "Outro exemplo honesto (ex: 'Cachorro')",
      "impostor": "Outro exemplo impostor (ex: 'Lobo')"
    }
  ]
}
Gere entre 8 e 12 cenários que sejam sutilmente parecidos, mas diferentes o suficiente para gerar suspeita durante a rodada.`;
  return callGeminiAPI(prompt, apiKey);
}
