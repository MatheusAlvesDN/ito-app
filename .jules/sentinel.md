## 2025-07-08 - Prevent Infinite Loop DoS from Unbounded Input
**Vulnerability:** A `do...while` loop bounded by 100 choices in `GameScreen` would become infinite and cause a Denial of Service if the `connectedPlayers` array exceeded 100 elements.
**Learning:** P2P connection logic and user-facing player registration inputs were completely unbounded, allowing an attacker to trivially bypass the UI, connect many simulated peers, overflow the player array, and trigger an infinite loop during game setup (exhausting browser resources).
**Prevention:** Always enforce strict length limits on arrays acting as inputs to computationally bounded loops, both at the UI layer and at the P2P message handling layer.
