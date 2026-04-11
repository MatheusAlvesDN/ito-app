## 2024-05-24 - React Pure Render Violation with Math.random()
**Learning:** Using `Math.random()` directly within component render logic (e.g., generating 50 confetti particles) violates React's pure render rules. This causes expensive recalculations on every re-render and produces unstable, jittery UI state and animations.
**Action:** Extract random values and expensive initializations into a `useState` lazy initializer `useState(() => ...)` to ensure they are calculated only once upon mounting.
