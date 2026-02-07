## 2024-05-23 - Secure Randomness in Game Mechanics
**Vulnerability:** Use of `Math.random()` for generating hidden player numbers, which is predictable and unfair for game mechanics.
**Learning:** `Math.random()` is not cryptographically secure. The project provides `src/utils/secureRandom.ts` specifically for this purpose.
**Prevention:** Always use `getSecureRandomInt` for game mechanics involving hidden information or fairness. Reserve `Math.random()` for purely visual effects (e.g., animations).
