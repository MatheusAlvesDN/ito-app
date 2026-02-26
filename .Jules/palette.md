## 2024-05-23 - Animated Buttons in Playwright
**Learning:** Elements with `animate-bounce` or similar CSS animations are considered "unstable" by Playwright's strict checks, causing `click()` to timeout.
**Action:** Use `force=True` when clicking animated elements or disable animations during testing if possible.
