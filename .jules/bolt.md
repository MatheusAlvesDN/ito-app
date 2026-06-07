## 2024-06-07 - Lazy initialization for random state
**Learning:** React purity rules fail when `Math.random()` is called directly inside a functional component body (like calculating initial positions for a Confetti effect), as it makes rendering unpredictable.
**Action:** Use `useState` with a lazy initializer function `useState(() => ...)` to encapsulate one-off random calculations that shouldn't change between renders. This avoids re-calculating on every render, boosting performance slightly and satisfying ESLint purity rules.
