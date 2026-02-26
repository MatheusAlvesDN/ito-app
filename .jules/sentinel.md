## 2024-05-22 - Insecure Random Number Generation in Game Logic
**Vulnerability:** Game logic (player number assignment and question selection) relied on `Math.random()`, which is not cryptographically secure and predictable.
**Learning:** `Math.random()` was used despite `getSecureRandomInt` being available in `src/utils/secureRandom.ts`. The import was commented out.
**Prevention:** Always use `getSecureRandomInt` (or `crypto.getRandomValues`) for game mechanics where fairness or unpredictability is required. Reserve `Math.random()` for visual effects only.
