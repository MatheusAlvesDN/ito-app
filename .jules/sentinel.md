## 2024-05-15 - [DoS via Unbounded State Arrays]
**Vulnerability:** Client-side DoS and memory exhaustion due to unbounded player arrays and text inputs.
**Learning:** React state arrays (`players`) populated directly from user input without length limits (`maxLength`) or item count bounds (< 20) can cause application freezes or infinite loop triggers in downstream components (e.g., `do...while` in `GameScreen`).
**Prevention:** Always enforce `maxLength` on text inputs and validate length before array state updates on the client side.