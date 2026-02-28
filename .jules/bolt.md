## 2024-05-24 - [Extract Input State to Prevent Cascading Re-renders]
**Learning:** In a dynamic list component (like `RegisterScreen`), keeping text input state (`useState('inputValue')`) alongside the list array state causes the entire list to re-render on every single keystroke.
**Action:** Always isolate high-frequency state updates (like text inputs) into their own standalone components (`AddPlayerInput`) that accept callback props (`onAdd`) to update the parent list state only when necessary (e.g., on submit).

## 2024-05-24 - [Lazy Initialization for Random State in Render]
**Learning:** Using impure functions like `Math.random()` directly in `useState` or `useMemo` initializers causes linter errors (`react-hooks/purity`) and potential UI instability on re-renders.
**Action:** Use lazy initialization with a callback function `useState(() => generateRandomArray())` for complex state initialization that includes random elements. This satisfies the purity rules and avoids recalculating expensive arrays (like Confetti particles) on every render.
