## 2025-05-18 - Prevent infinite loop DoS via bounded randomization
**Vulnerability:** A `do...while` loop bounded by a pool of 100 choices was used for random assignment. Unrestricted input sizes could result in an infinite loop DoS and memory exhaustion.
**Learning:** Bounded randomized algorithms require strict input length caps far smaller than the available pool size to ensure predictable runtime and safety.
**Prevention:** Always cap array/input sizes when performing random generation without replacement using limited pools.