## 2025-02-21 - Weak Randomness in Game Logic
**Vulnerability:** The application used `Math.random()` for generating secret game numbers and question selection. `Math.random()` is not cryptographically secure and can be predicted.
**Learning:** Even in client-side games, if secrecy is a mechanic, weak randomness undermines the integrity.
**Prevention:** Always use `window.crypto.getRandomValues()` (or `src/utils/secureRandom.ts` helper) for any value that needs to be unpredictable.
