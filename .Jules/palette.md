## 2025-02-18 - Animated Buttons and Test Automation
**Learning:** UI elements with infinite animations (like `animate-bounce`) can cause Playwright tests to timeout because the element is never considered "stable".
**Action:** Use `force=True` when clicking animated elements in Playwright scripts to bypass stability checks.

## 2025-02-18 - Randomness in React Components
**Learning:** Generating random values directly in the render body causes "impure function" lint errors and potentially unstable UI during re-renders.
**Action:** Generate random values (like confetti particles) inside `useEffect` (or `useMemo` if stable) to ensure stability and satisfy React purity rules.
