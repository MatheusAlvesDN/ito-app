## 2024-05-29 - Prevent DoS via Infinite Loop in GameScreen
**Vulnerability:** Unrestricted maximum player count combined with a `do...while` loop bounded to 100 choices created a potential infinite loop Denial of Service (DoS) and memory exhaustion vector.
**Learning:** The random number assignment logic relies on choosing unique numbers up to 100. If the player count reaches or exceeds 100, the `do...while` loop runs indefinitely trying to find a unique number that does not exist.
**Prevention:** Implement strict length limits on arrays and inputs before processing them in bounding loops to prevent infinite loops and memory exhaustion. Specifically, bounded the max players to 20 and max length of player names to 30.
