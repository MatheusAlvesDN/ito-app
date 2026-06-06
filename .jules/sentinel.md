## 2024-06-06 - Infinite Loop DoS in Number Generation
**Vulnerability:** The application was vulnerable to an infinite loop DoS and memory exhaustion in `GameScreen.tsx`. The unbounded `do...while` loop assigned random numbers to players up to 100 choices without a limit on the number of players.
**Learning:** Hardcoded logic boundaries that iterate over unbounded, user-controlled data structures (like adding an infinite number of players) easily result in infinite loops or memory leaks when the space of choices is limited (e.g., 1..100).
**Prevention:** Always bound loops and user-controlled arrays, limiting max inputs (like `max_players=20` and string `maxLength`) at the source of data entry (UI/App).
