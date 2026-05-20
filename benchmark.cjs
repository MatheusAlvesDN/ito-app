const { performance } = require('perf_hooks');

const QUESTIONS_DB = {
    classic: Array.from({ length: 50 }, (_, i) => `Classic Question ${i}`),
    anime: Array.from({ length: 50 }, (_, i) => `Anime Question ${i}`),
    sports: Array.from({ length: 50 }, (_, i) => `Sports Question ${i}`),
    history: Array.from({ length: 50 }, (_, i) => `History Question ${i}`),
};

const themes = [
    { id: 'classic', color: 'bg-yellow-100' },
    { id: 'anime', color: 'bg-orange-100' },
    { id: 'sports', color: 'bg-green-100' },
    { id: 'history', color: 'bg-blue-100' },
];

function oldApproach() {
    const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
    if (allQuestions.length > 0) {
        const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        const t = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(q)) || themes[0];
    }
}

function newApproach() {
    let totalQuestions = 0;
    for (const t of themes) {
        totalQuestions += (QUESTIONS_DB[t.id] || []).length;
    }

    if (totalQuestions > 0) {
        let randomIndex = Math.floor(Math.random() * totalQuestions);
        let selectedQuestion = '';
        let selectedTheme = themes[0];

        for (const t of themes) {
            const questions = QUESTIONS_DB[t.id] || [];
            if (randomIndex < questions.length) {
                selectedQuestion = questions[randomIndex];
                selectedTheme = t;
                break;
            }
            randomIndex -= questions.length;
        }
    }
}

const ITERATIONS = 100000;

const startOld = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    oldApproach();
}
const endOld = performance.now();

const startNew = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    newApproach();
}
const endNew = performance.now();

console.log(`Old Approach: ${endOld - startOld}ms`);
console.log(`New Approach: ${endNew - startNew}ms`);
console.log(`Speedup: ${((endOld - startOld) / (endNew - startNew)).toFixed(2)}x`);
