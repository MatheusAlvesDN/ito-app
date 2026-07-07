## 2024-07-07 - Prevent DoS via Array Length Limit in Random Assignment
**Vulnerability:** The application used a `do { ... } while()` loop bounded by 100 choices for random number generation in game screens. However, there was no limit enforced on player array lengths, allowing malicious actors to cause an infinite loop and application Denial of Service (DoS) by injecting more than 100 players.
**Learning:** Bounded loops must have corresponding constraints on their inputs to prevent infinite loop conditions, especially when handling user-provided data structures or P2P messages.
**Prevention:** Always enforce strict validation limits on unbounded arrays (e.g., max 20 players) at all entry points (UI registration and network listeners) before processing them in bounded logic.
