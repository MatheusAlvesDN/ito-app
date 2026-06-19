## 2025-06-19 - Avoid Purity Error and Re-evaluation on Render in Confetti

**Learning:** Initializing random array of particles with inline `Math.random()` in a component causes unnecessary recalculations and `react-hooks/purity` eslint errors.
**Action:** Always encapsulate one-off random calculations using lazy initialization inside `useState(() => ...)` and wrap the pure presentation component with `memo()` to prevent unnecessary re-renders when the parent tree updates.
