## 2024-06-24 - Missing Maximum Player Limits
**Vulnerability:** The application allowed an unlimited number of players to be added to local games and P2P multiplayer rooms, leading to a potential Denial of Service (DoS) vulnerability via infinite loop or excessive resource consumption.
**Learning:** The lack of strict boundaries on array lengths in UI input handlers and WebRTC connection handlers can be exploited or cause crashes due to intensive operations (like do-while loops used for random assignments bounded by 100).
**Prevention:** Always enforce strict maximum limits on arrays derived from user inputs or network connections, especially when those arrays are used in loops or bounds checks.
