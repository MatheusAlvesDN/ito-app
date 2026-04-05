## 2024-03-05 - Lazy Initialize Random Particles
**Learning:** `Math.random()` calls inside render bodies cause `react-hooks/purity` lint errors and result in recalculating values (like confetti position/colors) constantly. Array iteration for inline random generation is especially costly if triggering on every re-render.
**Action:** Always wrap heavy random logic or array initialization in a `useState` lazy initializer function (`useState(() => Array.from(...))`) when values only need to be determined once upon component mount.
