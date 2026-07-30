// Serviço unificado de Haptics / Vibração para o Party Games
// Compatível com navegadores móveis (Web Vibration API), Webview e Capacitor

export const hapticsService = {
  /**
   * Vibração leve e curta (ex: tocar em botões, alternar cartas)
   */
  impactLight: () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (e) {
      console.warn('Vibration not supported', e);
    }
  },

  /**
   * Vibração média (ex: arrastar card, soltar card)
   */
  impactMedium: () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(25);
      }
    } catch (e) {
      console.warn('Vibration not supported', e);
    }
  },

  /**
   * Vibração intensa (ex: revelar identidade secreta, confirmar voto)
   */
  impactHeavy: () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (e) {
      console.warn('Vibration not supported', e);
    }
  },

  /**
   * Padrão curto e feliz de vitória/sucesso (ex: ordem correta no ITO)
   */
  vibrateSuccess: () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 50, 40]);
      }
    } catch (e) {
      console.warn('Vibration not supported', e);
    }
  },

  /**
   * Padrão triste/longo de erro (ex: ordem errada, sabotagem)
   */
  vibrateError: () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([80, 50, 80]);
      }
    } catch (e) {
      console.warn('Vibration not supported', e);
    }
  },
};
