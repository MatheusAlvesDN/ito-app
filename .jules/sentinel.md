# Sentinel's Journal

## 2025-02-18 - Secure Randomness in React
**Vulnerability:** Weak PRNG (`Math.random()`) used for game mechanics (player numbers), allowing potential prediction.
**Learning:** `Math.random()` is not cryptographically secure. In React, random values must be generated inside `useEffect` or `useMemo` to maintain purity and avoid hydration mismatches.
**Prevention:** Use `window.crypto.getRandomValues` (via `getSecureRandomInt`) for any game logic involving fairness or secrets.
