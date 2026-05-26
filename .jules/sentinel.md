## 2024-05-26 - Prevention of DoS via Infinite Loop
**Vulnerability:** A `do...while` loop bounded by 100 choices in `GameScreen.tsx` for random number assignment could result in an infinite loop DoS and memory exhaustion if the user added over 100 players.
**Learning:** Client-side loops matching unique numbers to array lengths must be bounded. Without validation, an attacker (or unconstrained user) could hang the browser tab by requesting more unique numbers than the available pool.
**Prevention:** Enforce input constraints on user counts (e.g., maximum of 20 players) prior to allowing the logical calculation.
