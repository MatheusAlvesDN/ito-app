## 2024-03-20 - Infinite Loop DoS via Unbounded Player Array
**Vulnerability:** Application crashes (infinite loop DoS) if more than 100 players are added.
**Learning:** `GameScreen.tsx` assigns unique random numbers between 1-100 to players using a `do...while` loop and rejection sampling (`usedNumbers.has(num)`). If `players.length >= 100`, the loop can never terminate because there are not enough unique numbers available, crashing the thread. Additionally, unbounded arrays cause React rendering memory exhaustion.
**Prevention:** Always bound the maximum length of arrays populated by user input, especially when the length dictates termination conditions in loops.
