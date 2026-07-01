## 2024-05-14 - Denial of Service (Infinite Loop)
**Vulnerability:** A DoS vulnerability where malicious actors could crash the app by adding more than 100 players, causing an infinite loop in the `Math.random` number distribution logic in GameScreens.
**Learning:** Unbounded user input mapped to finite logic loops (like assigning 100 possible unique numbers to players) creates DoS risks.
**Prevention:** Always enforce strict length limits on arrays representing user input/connections, especially when those arrays are used in loops with finite possibility spaces.
