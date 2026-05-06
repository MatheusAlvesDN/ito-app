## 2024-05-18 - Prevent DoS and memory exhaustion via unbounded inputs
**Vulnerability:** A `do...while` loop bounded by 100 choices in `GameScreen.tsx` causes infinite loop and memory exhaustion if more than 100 players are added.
**Learning:** Hardcoded algorithmic bounds strictly necessitate matching UI/input constraints. Long unbounded strings can further degrade performance.
**Prevention:** Always implement array length bounds and string maximum lengths at the input layer before data reaches sensitive algorithms.
