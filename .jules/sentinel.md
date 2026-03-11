## 2024-06-25 - Client-Side Denial of Service via Unbounded State and do...while

**Vulnerability:** A combination of an unbounded `players` array array in `App.tsx` and a bounded `do { ... } while(usedNumbers.has(num))` loop in `GameScreen.tsx` (which generates numbers between 1 and 100) allowed a user to crash the browser. If more than 100 players were added, the loop would run infinitely trying to find a unique number.

**Learning:** Client-side array state built from user input must always be bounded, especially if downstream logic depends on those arrays having a finite maximum size. A `do...while` loop that depends on random collision resolution is dangerous if the pool of available unique numbers is smaller than the required number of iterations.

**Prevention:** Always enforce a maximum length on text inputs (`maxLength`) and a maximum length on state arrays that are populated by users.
