## 2024-05-13 - Insecure Random Number Generation in Game Logic
**Vulnerability:** Weak random number generation using `Math.random()` for critical game logic (assigning secret numbers and choosing questions).
**Learning:** React game state needs secure random generation to prevent predictability, especially when secrecy is a core game mechanic.
**Prevention:** Always use `getSecureRandomInt()` from `src/utils/secureRandom.ts` for any logical game randomness. Visual/purely cosmetic effects can still use `Math.random()`.

## 2024-05-13 - Unbounded Input Array DoS Vulnerability
**Vulnerability:** Missing `maxLength` on player name input allows adding arbitrarily large strings to the application state, leading to potential memory exhaustion or UI crash.
**Learning:** Client-side React state arrays are vulnerable to DoS if populated by unbounded text inputs.
**Prevention:** Always enforce `maxLength` on text inputs and validate length before state updates when adding items to an array or list.
