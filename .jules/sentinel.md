## Sentinel Journal

## 2024-05-22 - Insecure Randomness in Game Logic
**Vulnerability:** Used `Math.random()` for generating secret player numbers and selecting questions.
**Learning:** `Math.random()` is not cryptographically secure and can be predictable, which compromises fairness in games involving hidden information.
**Prevention:** Use `crypto.getRandomValues()` (or a wrapper like `getSecureRandomInt`) for any game mechanic that relies on secrecy or fairness, not just for cryptography.
