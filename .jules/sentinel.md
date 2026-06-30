## 2024-06-30 - Prevented Denial of Service via Array Memory Exhaustion
**Vulnerability:** A missing check on the size of the `connectedPlayers` array in `syncService.ts` when processing 'JOIN' messages could allow an attacker to indefinitely add new players to a room, leading to a Denial of Service through array size explosion, memory exhaustion, or triggering an infinite loop where UI elements process players.
**Learning:** In a peer-to-peer or server-side component where external devices can join using events, all dynamic collections must be strictly bounded.
**Prevention:** Implement clear length limits corresponding to application design boundaries (e.g., maximum 20 players) for any array modified by external input, rejecting changes that exceed limits securely and defensively.
