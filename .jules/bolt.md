## 2024-05-22 - Impure Render in Confetti Component
**Learning:** The `Confetti` component in `src/GameScreen.tsx` generates random particles (including styles and positions) directly inside the render body. This violates React purity principles and causes full recreation of 50 DOM nodes on every parent re-render, leading to potential visual jitter and unnecessary layout thrashing.
**Action:** When working with random visual effects in React, ensure generation logic is memoized (`useMemo`) or initialized in state (`useState`) to maintain stability across renders and avoid impure side effects.
