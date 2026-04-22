## 2025-04-22 - Prevent Infinite Loop DoS
**Vulnerability:** Unbounded array inputs mapping to random pools in `GameScreen.tsx` with a finite loop break, paired with lack of input limits in `App.tsx`, enabled a Denial of Service through memory exhaustion and infinite loops.
**Learning:** Bounded `do...while` loops for unique selections must have strict input validation to prevent infinite blocking loops.
**Prevention:** Always enforce logical bounds on inputs mapping to limited randomization pools.
