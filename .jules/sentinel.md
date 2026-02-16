## 2026-02-16 - [Secure Randomness Utility]
**Vulnerability:** Predictable game state via `Math.random()`.
**Learning:** The project had an unused `secureRandom.ts` which was not fully isomorphic for testing.
**Prevention:** Use `getSecureRandomInt` from `src/utils/secureRandom.ts` for all game logic and security-sensitive randomness. Ensure utilities check `globalThis.crypto` or `window.crypto`.
