const { performance } = require('perf_hooks');

const QUESTIONS_DB = {
    classic: Array.from({length: 100}, (_, i) => `Q${i}`),
    anime: Array.from({length: 100}, (_, i) => `A${i}`),
    free: []
};
const themes = [
    {id: 'classic', color: 'red'},
    {id: 'anime', color: 'blue'}
];

const ITERS = 100000;

const startOriginal = performance.now();
for (let i = 0; i < ITERS; i++) {
    const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
    if (allQuestions.length > 0) {
        const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        const t = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(q)) || themes[0];
    }
}
const endOriginal = performance.now();

const startOptimized = performance.now();
for (let i = 0; i < ITERS; i++) {
    let totalQuestions = 0;
    for (const t of themes) {
      totalQuestions += (QUESTIONS_DB[t.id] || []).length;
    }

    if (totalQuestions > 0) {
        let globalIndex = Math.floor(Math.random() * totalQuestions);
        let selectedTheme = themes[0];
        let selectedQuestion = '';

        for (const t of themes) {
          const qList = QUESTIONS_DB[t.id] || [];
          if (globalIndex < qList.length) {
            selectedTheme = t;
            selectedQuestion = qList[globalIndex];
            break;
          }
          globalIndex -= qList.length;
        }
    }
}
const endOptimized = performance.now();

console.log(`Original: ${endOriginal - startOriginal}ms`);
console.log(`Optimized: ${endOptimized - startOptimized}ms`);
