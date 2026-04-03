## 2024-04-03 - [App] Fix PRNG logic and DoS vulnerability
**Vulnerability:** Insecure PRNG (using `Math.random()`) for player number assignments, which is not cryptographically secure, and unbounded array allocation/string lengths in `src/App.tsx`, leading to a potential infinite loop or memory exhaustion DoS.
**Learning:** `Math.random()` was used for secure random assignment in the `do...while` loop, allowing predictability. Also, uncontrolled state arrays populated by user input can cause DoS if not capped.
**Prevention:** Use `getSecureRandomInt()` for security-critical random assignments. Always enforce bounds limits on text inputs (`maxLength`) and state arrays populated by user input.
