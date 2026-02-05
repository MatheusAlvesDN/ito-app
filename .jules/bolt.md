## 2024-05-22 - Impure Render Functions & Math.random
**Learning:** React strict mode flags `Math.random()` in render as impure. This causes unstable UI (e.g., jumping animations) when components re-render.
**Action:** Move random generation to `useEffect` (for client-side only visual effects) or pass as props. For `useState` lazy initialization, remember it also runs in render, so it must be pure. Use `useEffect` + `setState` for truly random client-side data, accepting the double-render trade-off for purity.
