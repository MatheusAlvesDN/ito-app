## 2024-05-18 - Infinite Loop DoS in Random Assignment
**Vulnerability:** Infinite loop denial of service in random number generation.
**Learning:** Unbounded state growth (e.g. infinite players) and string constraints could allow infinite loop execution leading to application freeze.
**Prevention:** Enforce boundaries like maximum array lengths (e.g., maximum 20 players) and maximum string lengths to avoid state explosion.
