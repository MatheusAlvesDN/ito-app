## 2024-05-24 - DoS Vulnerability via Unbounded Input Loop
**Vulnerability:** The application allowed an unlimited number of players to be added, leading to an infinite loop DoS condition when assigning unique numbers from 1-100 in `GameScreen.tsx`. It also lacked `maxLength` on player name inputs, increasing memory exhaustion risks.
**Learning:** Bounded randomization pools (`do...while` generating numbers 1-100) must have input arrays significantly smaller than the pool to prevent infinite loops. Unbounded client-side state arrays populated by text inputs represent a significant DoS risk.
**Prevention:** Always cap array sizes when using bounded randomization pools and enforce `maxLength` on text inputs before updating state.
