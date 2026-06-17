## 2024-06-17 - Array Size DoS in Number Generation
**Vulnerability:** The random number generation loop `do { num = ... } while (usedNumbers.has(num))` in GameScreen is bounded by 100 but can easily infinite-loop if the players array is large, causing a Denial of Service (DoS) and crashing the browser.
**Learning:** O(N) client-side loops dependent on unbounded array sizes provided by P2P connections are trivial to exploit.
**Prevention:** Always enforce strict maximum limits on state arrays (like players) both at the UI entry point and within P2P synchronization layers.
