
## 2024-05-30 - Prevent inline Math.random() re-renders with lazy useState
**Learning:** In React components, to avoid `react-hooks/purity` ESLint errors when a one-off random calculation is needed (like generating initial positions with `Math.random()`), encapsulate the calculation using lazy initialization inside `useState(() => ...)` instead of `useMemo` or the render body, as both execute during the render phase and will trigger the impurity warning.
**Action:** Always wrap one-off random calculations inside `useState(() => ...)` lazy initializers to ensure they run exactly once and maintain component purity.
