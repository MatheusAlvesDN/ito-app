## 2024-05-18 - Fix Infinite Loop DoS in Game Screen
**Vulnerability:** Client-side Infinite Loop DoS leading to browser crash.
**Learning:** `GameScreen.tsx` assigns unique random numbers via a `do...while` loop bounded by 100 choices. If the number of players exceeds 100, the loop becomes infinite, exhausting resources and causing a crash. Also, an unbounded text input array could lead to memory exhaustion.
**Prevention:** Always enforce strict bounds on dynamic collections that feed into bounded algorithms. Implemented a maximum cap of 20 players and added `maxLength` on player name inputs.
