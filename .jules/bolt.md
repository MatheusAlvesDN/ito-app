## 2026-05-28 - Avoid recreating random arrays in React renders
**Learning:** Recreating arrays with random values inside a component's render body not only causes unnecessary CPU work but can also lead to visual glitches if the component re-renders.
**Action:** Use `useMemo` to cache arrays that are populated with random values during initialization, and `React.memo` for static UI components like Confetti.
