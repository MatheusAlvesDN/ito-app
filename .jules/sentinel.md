## 2025-02-14 - Prevent Infinite Loop DoS via Collection Length Limit
**Vulnerability:** Unbounded player registration allowed an infinite `do...while` loop during game setup (due to 100 max bounds on random choice allocation), causing Denial of Service.
**Learning:** When game logic relies on bounded loops for uniqueness (e.g., generating unique numbers 1-100), upstream array sizes must be strictly clamped below that bound to prevent infinite loops.
**Prevention:** Always enforce maximum limits on collections that drive randomized loops, both on the UI level and network data processing layer.
