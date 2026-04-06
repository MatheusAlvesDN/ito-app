## 2024-04-06 - Prevent DoS via Unbounded Input Limits
**Vulnerability:** Client-side unbounded inputs allowed infinite state arrays and string memory exhaustion, posing a DoS risk in randomization logic.
**Learning:** State arrays updated by unbounded inputs can crash the browser. Bounded random loops (e.g., 1-100) become infinite loops if input elements exceed the bounds.
**Prevention:** Always enforce `maxLength` on inputs and cap maximum elements stored in client-side arrays, especially when they feed into constrained loops.
