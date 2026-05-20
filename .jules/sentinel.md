## 2024-05-24 - Secure Random Usage
**Vulnerability:** Weak random number generation for game logic using `Math.random()`.
**Learning:** `Math.random()` was being used for secure/game-critical randomness, which could allow predictability. The project has a `getSecureRandomInt` util specifically for this purpose.
**Prevention:** Use `getSecureRandomInt` for game-critical logic to prevent predictability.
