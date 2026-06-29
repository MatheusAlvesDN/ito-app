## 2025-02-28 - Infinite Loop DoS Risk in Player Synchronization
**Vulnerability:** The application was vulnerable to an infinite loop DoS due to an unbounded player array. The `do { ... } while()` logic in `GameScreen.tsx` assigns unique numbers up to 100. If more than 100 players joined, the loop would hang indefinitely.
**Learning:** Even internal game mechanics can become attack vectors if input sizes (like player counts via P2P connections) are implicitly trusted and unconstrained.
**Prevention:** Always enforce strict, explicit limits on arrays or collections that feed into bounded loops or recursive functions, both at the UI layer and the network (syncService) layer.
