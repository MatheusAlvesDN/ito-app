const { performance } = require('perf_hooks');

const QUESTIONS_DB = {
    classic: Array.from({length: 100}).map((_, i) => `Classic ${i}`),
    anime: Array.from({length: 100}).map((_, i) => `Anime ${i}`),
    games: Array.from({length: 100}).map((_, i) => `Game ${i}`),
    movies: Array.from({length: 100}).map((_, i) => `Movie ${i}`)
};

const themes = [
    { id: 'classic', color: 'bg-yellow' },
    { id: 'anime', color: 'bg-orange' },
    { id: 'games', color: 'bg-blue' },
    { id: 'movies', color: 'bg-red' }
];

const iterations = 100000;

function approach1() {
    let dummyQ, dummyColor;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
        if (allQuestions.length > 0) {
            const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
            dummyQ = q;
            const t = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(q)) || themes[0];
            dummyColor = t.color;
        }
    }
    const end = performance.now();
    return end - start;
}

function approach2() {
    let dummyQ, dummyColor;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        let totalQuestions = 0;
        for (let j = 0; j < themes.length; j++) {
            totalQuestions += (QUESTIONS_DB[themes[j].id] || []).length;
        }

        if (totalQuestions > 0) {
            let globalIndex = Math.floor(Math.random() * totalQuestions);
            for (let j = 0; j < themes.length; j++) {
                const questions = QUESTIONS_DB[themes[j].id] || [];
                if (globalIndex < questions.length) {
                    dummyQ = questions[globalIndex];
                    dummyColor = themes[j].color;
                    break;
                }
                globalIndex -= questions.length;
            }
        }
    }
    const end = performance.now();
    return end - start;
}

const t1 = approach1();
const t2 = approach2();

console.log(`Approach 1 (flatMap + find + includes): ${t1.toFixed(2)}ms`);
console.log(`Approach 2 (pre-calculated + iteration): ${t2.toFixed(2)}ms`);
console.log(`Speedup: ${((t1 - t2) / t1 * 100).toFixed(2)}%`);
