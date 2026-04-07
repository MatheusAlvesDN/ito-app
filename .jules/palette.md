## 2025-04-07 - Playwright aria-label Resolution
**Learning:** When verifying elements with dynamically added `aria-label` attributes using Playwright, `page.get_by_label(...)` can sometimes time out or fail with strict mode violations, especially when dealing with elements like icons.
**Action:** Instead of `get_by_label`, prefer `page.get_by_role("button", name="...")` for more reliable locator resolution when targeting buttons that have newly added `aria-label`s.
