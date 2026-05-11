const { performance } = require('perf_hooks');

const QUESTIONS_DB = {
    classic: Array.from({ length: 100 }, (_, i) => `C${i}`),
    anime: Array.from({ length: 100 }, (_, i) => `A${i}`)
};

const themes = [
    { id: 'classic', color: 'red' },
    { id: 'anime', color: 'blue' }
];

function oldWay() {
    const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
    if (allQuestions.length > 0) {
        const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        const t = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(q)) || themes[0];
        return [q, t.color];
    }
}

function newWay() {
    let totalQuestions = 0;
    for (let i = 0; i < themes.length; i++) {
        totalQuestions += (QUESTIONS_DB[themes[i].id] || []).length;
    }

    if (totalQuestions > 0) {
        let globalIndex = Math.floor(Math.random() * totalQuestions);
        let selectedTheme = themes[0];
        let selectedQuestion = "";

        for (let i = 0; i < themes.length; i++) {
            const questions = QUESTIONS_DB[themes[i].id] || [];
            if (globalIndex < questions.length) {
                selectedTheme = themes[i];
                selectedQuestion = questions[globalIndex];
                break;
            }
            globalIndex -= questions.length;
        }
        return [selectedQuestion, selectedTheme.color];
    }
}

const startOld = performance.now();
for(let i=0; i<1000000; i++) oldWay();
const endOld = performance.now();

const startNew = performance.now();
for(let i=0; i<1000000; i++) newWay();
const endNew = performance.now();

console.log(`Old: ${endOld - startOld}ms`);
console.log(`New: ${endNew - startNew}ms`);
console.log(`Speedup: ${(((endOld - startOld) - (endNew - startNew)) / (endOld - startOld) * 100).toFixed(2)}% faster (${((endOld - startOld) / (endNew - startNew)).toFixed(2)}x)`);
