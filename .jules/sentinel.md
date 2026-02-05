## 2026-02-05 - Secure Randomness for Game Mechanics
**Vulnerability:** Weak pseudo-random number generation (`Math.random()`) used for game mechanics involving hidden information (secret player numbers).
**Learning:** While `Math.random()` is sufficient for visual effects, game mechanics that rely on fairness and unpredictability (especially "secret" numbers) should use cryptographically secure random values to prevent theoretical prediction and ensure fairness.
**Prevention:** Use `window.crypto.getRandomValues()` (via `src/utils/secureRandom.ts`) for all game logic involving random selection or number generation.
