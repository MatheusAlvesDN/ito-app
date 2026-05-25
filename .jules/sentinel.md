## 2024-05-25 - Fix DoS via Unbounded Array in Game Logic
**Vulnerability:** Application crashed or exhausted resources due to an infinite loop in `GameScreen.tsx` when players count > 100, combined with no input limits on the register screen.
**Learning:** The random number assignment loop in `GameScreen.tsx` is bounded by 100 choices (`Math.floor(Math.random() * 100) + 1`). Allowing unbounded player registration causes an infinite loop DoS.
**Prevention:** Always enforce hard limits on user-provided arrays/inputs that dictate iteration or random distribution constraints, and add sensible `maxLength` attributes to inputs.
