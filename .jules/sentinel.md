## 2025-02-04 - Insecure Randomness in Game Mechanics

**Vulnerability:** Core game mechanics involving secret numbers and question selection were relying on `Math.random()`, which is not cryptographically secure and could potentially be predicted.
**Learning:** Even in casual games, mechanics that rely on fairness or hidden information should use secure randomness to prevent potential exploitation or bias. The codebase already had a `getSecureRandomInt` utility that was unused.
**Prevention:** Enforce the use of `getSecureRandomInt` (using `window.crypto.getRandomValues`) for any game logic involving secrets, shuffling, or fairness. Reserve `Math.random()` strictly for visual effects (like confetti) where security is irrelevant.
