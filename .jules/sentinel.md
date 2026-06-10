## 2024-05-28 - Denial of Service in GameScreen
**Vulnerability:** Unbounded player array allows infinite loop DoS during random number generation bounded by 100.
**Learning:** The `do...while` loop relying on unique randoms under 100 becomes infinite if the player count exceeds 100.
**Prevention:** Always enforce strict length limits (e.g., maximum 20) on user-facing arrays driving `while` loops.
