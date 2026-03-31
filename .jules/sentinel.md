## 2026-03-31 - [Initial Setup]\n**Vulnerability:** None yet\n**Learning:** Initializing sentinel journal\n**Prevention:** None
## 2026-03-31 - [Limit unbounded React state array inputs]
**Vulnerability:** Client-side React state arrays are vulnerable to DoS (memory exhaustion or application crashes) if populated by unbounded text inputs. A specific do...while loop logic bounds by 100 could cause infinite loop if players > 100.
**Learning:** React state variables populated from user inputs without limit validation can allow malicious inputs to overwhelm the client memory or trigger infinite loops if coupled with specific bounds.
**Prevention:** Always enforce `maxLength` on text inputs and validate max length (e.g., maximum number of players) before state updates to cap resource utilization.
