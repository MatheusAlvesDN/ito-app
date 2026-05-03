## 2024-05-03 - Denial of Service via Unbounded Input Array
**Vulnerability:** Client-side memory exhaustion and DoS via infinite loop (`do...while` in `GameScreen.tsx`) triggered by unbounded user addition in `App.tsx`.
**Learning:** `do...while` logic dependent on randomly assigned, unique subsets within a bounded integer range (e.g., 1 to 100) will permanently hang the browser thread if the subset size (e.g., number of players) exceeds the available bounds. This project lacked constraints on the array size at the entry point.
**Prevention:** Always enforce strict length validations at the data collection point (e.g., `maxLength` on inputs and fixed upper bounds on array additions) before passing the arrays to processing logic that scales iteratively or recursively.
