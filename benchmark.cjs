const { performance } = require('perf_hooks');

const QUESTIONS_DB = {
    classic: Array(100).fill("Question classic"),
    anime: Array(150).fill("Question anime"),
    sports: Array(120).fill("Question sports"),
    history: Array(80).fill("Question history"),
    science: Array(90).fill("Question science")
};

const themes = [
    { id: 'classic', color: 'bg-blue-500' },
    { id: 'anime', color: 'bg-red-500' },
    { id: 'sports', color: 'bg-green-500' },
    { id: 'history', color: 'bg-yellow-500' },
    { id: 'science', color: 'bg-purple-500' }
];

function oldMethod() {
    const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
    if (allQuestions.length > 0) {
        const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        const t = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(q)) || themes[0];
        return { q, t };
    }
}

function newMethod() {
    let totalQuestions = 0;
    for (const theme of themes) {
        totalQuestions += (QUESTIONS_DB[theme.id] || []).length;
    }

    if (totalQuestions > 0) {
        let globalIndex = Math.floor(Math.random() * totalQuestions);
        let selectedQuestion = '';
        let selectedTheme = themes[0];

        for (const theme of themes) {
            const questions = QUESTIONS_DB[theme.id] || [];
            if (globalIndex < questions.length) {
                selectedQuestion = questions[globalIndex];
                selectedTheme = theme;
                break;
            }
            globalIndex -= questions.length;
        }
        return { q: selectedQuestion, t: selectedTheme };
    }
}

const iterations = 100000;

const startOld = performance.now();
for (let i = 0; i < iterations; i++) oldMethod();
const endOld = performance.now();

const startNew = performance.now();
for (let i = 0; i < iterations; i++) newMethod();
const endNew = performance.now();

console.log(`Old method: ${endOld - startOld} ms`);
console.log(`New method: ${endNew - startNew} ms`);
