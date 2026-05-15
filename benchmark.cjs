const { performance } = require('perf_hooks');

const QUESTIONS_DB = {};
const themes = [];
for (let i = 0; i < 50; i++) {
  const id = `theme_${i}`;
  themes.push({ id, color: 'red' });
  QUESTIONS_DB[id] = [];
  for (let j = 0; j < 100; j++) {
    QUESTIONS_DB[id].push(`Question ${i} ${j}`);
  }
}

function oldWay() {
  const allQuestions = themes.flatMap(t => QUESTIONS_DB[t.id] || []);
  if (allQuestions.length > 0) {
      const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
      const t = themes.find(t => (QUESTIONS_DB[t.id] || []).includes(q)) || themes[0];
      return { q, t };
  }
}

function newWay() {
  let totalQuestions = 0;
  for (const t of themes) {
    totalQuestions += (QUESTIONS_DB[t.id] || []).length;
  }

  if (totalQuestions > 0) {
    let globalIndex = Math.floor(Math.random() * totalQuestions);
    for (const t of themes) {
      const questions = QUESTIONS_DB[t.id] || [];
      if (globalIndex < questions.length) {
        return { q: questions[globalIndex], t };
      }
      globalIndex -= questions.length;
    }
  }
}

const ITERATIONS = 10000;

const startOld = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  oldWay();
}
const endOld = performance.now();

const startNew = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  newWay();
}
const endNew = performance.now();

console.log(`Old way: ${endOld - startOld}ms`);
console.log(`New way: ${endNew - startNew}ms`);
