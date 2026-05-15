## 2024-05-15 - Insecure Randomness in Game Logic
**Vulnerability:** Game logic (player numbers and question selection) used `Math.random()`, which is not cryptographically secure and could potentially be predicted.
**Learning:** In a local context, weak randomness can lead to predictable patterns or allow players to guess outcomes.
**Prevention:** Always use `window.crypto.getRandomValues()` (via `getSecureRandomInt`) for any logic that requires unpredictability for security or fairness.