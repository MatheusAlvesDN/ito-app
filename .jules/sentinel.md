## 2024-05-24 - DoS Risk in Unbounded Rejection Sampling
**Vulnerability:** A `do...while` loop assigned 100 possible numbers to players. If the player count exceeded 100, an infinite loop would occur resulting in DoS and memory exhaustion.
**Learning:** Rejection sampling loops with a bounded random pool must mathematically guarantee termination by strictly capping inputs well below the pool limit.
**Prevention:** Enforced a UI cap of 20 maximum players to ensure the array size remains significantly smaller than the pool (100) and added input length limits (`maxLength=30`) on names.
