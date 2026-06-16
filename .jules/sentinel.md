## 2024-05-24 - [Infinite Loop DoS via Depleted Random Pool]
**Vulnerability:** The application used a `do...while` loop to select unique random numbers from a fixed pool (100 choices), but did not restrict the number of players.
**Learning:** If the number of players (iterations) exceeds the available choices in the random pool, the loop can never terminate, causing an infinite loop Denial of Service (DoS).
**Prevention:** Always enforce strict array length limits on inputs that dictate iterations over a bounded random pool.
