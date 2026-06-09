## 2024-05-24 - DoS vulnerability due to unbound array
**Vulnerability:** DoS (Denial of Service) infinite loop caused by unbounded array size.
**Learning:** In React components, an unbounded state array size combined with a while/do-while loop with an arbitrary hard limit can result in memory exhaustion and a hanging application if the array exceeds the loop condition's limit.
**Prevention:** Bound unbounded user inputs (like lists of participants) in the UI to prevent them from exceeding limits used in algorithms, protecting against infinite loops.
