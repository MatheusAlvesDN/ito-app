## 2024-05-18 - [Insecure Random Number Generation]
**Vulnerability:** The game assigned secret numbers to players using `Math.random()`, which is not cryptographically secure and could be predicted, affecting the integrity of the game.
**Learning:** `Math.random()` should only be used for visual effects or non-critical logic. A utility file `secureRandom.ts` was present but unused.
**Prevention:** Always use a cryptographically secure random number generator (like `crypto.getRandomValues`) for any logic that determines game outcomes, roles, or secret values.

## 2024-05-18 - [Cross-Environment Compatibility for Web Crypto]
**Vulnerability:** N/A (Enhancement)
**Learning:** Using `window.crypto.getRandomValues()` restricts the utility to browser environments. In environments like Node.js testing frameworks, `window` might not be defined.
**Prevention:** Use the global `crypto` object (`crypto.getRandomValues()`) directly to support both modern browsers and other JS environments like Node.js natively.