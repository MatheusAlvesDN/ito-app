## 2024-05-23 - Insecure Randomness in Game Logic
**Vulnerability:** The application used the insecure `Math.random()` function to generate random secrets (player numbers) and select random elements for game mechanics.
**Learning:** `Math.random()` does not provide cryptographically secure random numbers, making outcomes potentially predictable or susceptible to PRNG state recovery attacks. The codebase already had a `getSecureRandomInt` utility which was commented out and unused.
**Prevention:** Always use cryptographically secure PRNGs (like `window.crypto.getRandomValues`) via established utility functions (e.g., `getSecureRandomInt`) when generating numbers that affect sensitive game logic or secrets.
