## 2024-03-19 - DoS via Unbounded Inputs and Infinite Loops
**Vulnerability:** The player registration flow allowed infinitely long player names and an unlimited number of players. This could lead to client-side memory exhaustion (DoS) and an infinite loop crash in `GameScreen.tsx` (which assigns numbers using a `do...while` loop bounded by 100 choices).
**Learning:** Client-side states (arrays, strings) populated by user input without length constraints are highly susceptible to resource exhaustion attacks, even in single-page apps without a backend.
**Prevention:** Always enforce `maxLength` on text inputs, and validate maximum collection sizes (e.g., maximum number of items in a list) before updating state.
