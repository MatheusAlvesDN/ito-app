## 2024-05-24 - Infinite Loop DoS in Random Number Assignment
**Vulnerability:** Unbounded array size for players allowed an infinite do...while loop during random number assignment.
**Learning:** GameScreen.tsx assigns unique numbers between 1 and 100. If players.length exceeds 100 (or approaches it), the do...while loop causes memory exhaustion and browser freezing.
**Prevention:** Enforce hard limits on array sizes that drive bounded loops and limit input length to prevent excessive memory usage.