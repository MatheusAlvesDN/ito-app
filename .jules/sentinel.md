## 2025-04-24 - Fix Infinite Loop DoS from Unbounded Array Size
**Vulnerability:** A `do...while` loop bounded by a static limit of 100 choices combined with an unbounded number of players created an infinite loop Denial of Service (DoS) and memory exhaustion vector in GameScreen.
**Learning:** Bounded randomization pools must enforce size limits on inputs that correspond to pool allocations to avoid infinite loops. Unrestricted user-controlled arrays passed to fixed-pool allocation logic are a critical architectural gap.
**Prevention:** Always restrict user-controlled arrays to a maximum significantly smaller than fixed assignment pools, and enforce input length limitations early at the point of creation.
