## 2024-05-24 - Prevent DoS via Infinite Loop in GameScreen
**Vulnerability:** The application could suffer a Denial of Service (infinite loop) in the random number assignment if the player list length exceeds the available options (100 choices).
**Learning:** Client-side arrays and external P2P messages must be strictly bounded to prevent infinite loop regressions in randomization logic.
**Prevention:** Enforce hard limits (e.g., maximum 20 players) at the UI, state, and network (PeerJS) boundaries.
