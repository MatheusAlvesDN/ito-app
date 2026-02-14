## 2024-05-23 - Secure Randomness in Game Logic
**Vulnerability:** Predictable RNG in game mechanics (shuffling, secret numbers).
**Learning:** `Math.random()` is not cryptographically secure and can be predictable, potentially allowing players to cheat or predict game outcomes.
**Prevention:** Always use `getSecureRandomInt` (which uses `window.crypto`) for all game-critical random number generation. Cosmetic effects can use `Math.random()` for performance.
