## 2024-05-18 - Insecure Randomness in Game Logic
**Vulnerability:** Game logic (random number assignment and question selection) was using the insecure `Math.random()` function.
**Learning:** `Math.random()` does not provide cryptographically secure random numbers and can lead to predictable patterns, which is a vulnerability in game logic where randomness is critical to fairness and security (e.g., hidden number assignments).
**Prevention:** Always use the provided `getSecureRandomInt` utility from `src/utils/secureRandom.ts` which utilizes `window.crypto.getRandomValues()` for operations requiring strong randomness.
