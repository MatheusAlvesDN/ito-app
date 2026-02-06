## 2024-05-24 - Stable Random Data in React
**Learning:** Generating random data (like particle positions) inside the component body causes layout thrashing and visual jitter on every re-render.
**Action:** Use `useState` with a lazy initializer (e.g., `useState(() => generateData())`) to compute random values once on mount and keep them stable.
