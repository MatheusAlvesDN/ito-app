## 2024-05-23 - Insecure Randomness in Game Logic
**Vulnerability:** Use of `Math.random()` for generating secret player numbers and selecting questions.
**Learning:** Even in casual games, predictable RNG can allow cheating or manipulation. `Math.random()` is not cryptographically secure.
**Prevention:** Use `window.crypto.getRandomValues()` (or `getSecureRandomInt` utility) for any game mechanic involving hidden information, fairness, or security.
