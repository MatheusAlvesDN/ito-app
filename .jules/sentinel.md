## 2025-02-12 - Secure Random in React Components
**Vulnerability:** `Math.random()` usage for game-critical logic and visual effects in React components.
**Learning:** `Math.random()` is cryptographically insecure and impure. React linter flags it in render phase.
**Prevention:** Use `getSecureRandomInt` (using `crypto.getRandomValues`) for logic. For visual effects needing randomness, use `useState(() => ...)` lazy initialization to maintain purity and stability.
