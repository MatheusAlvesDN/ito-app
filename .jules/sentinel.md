## 2024-05-15 - Prevent Denial of Service in Random Number Generation
**Vulnerability:** The application is vulnerable to an infinite loop DoS due to unrestricted player limits when assigning random numbers in game screens (e.g., `ito/GameScreen.tsx`) where numbers are drawn from a limited pool (1-100) using a `do...while` loop. If the number of players exceeds the pool size, the loop never terminates.
**Learning:** Game mechanics that rely on bounded pools of unique items must explicitly restrict the maximum number of participants at the entry point (e.g., lobby or registration).
**Prevention:** Implement strict length limits on arrays representing user participants before entering the game loop, both in local UI registration and in P2P synchronization layers.
