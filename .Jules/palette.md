## 2024-05-24 - Strict Mode Violations with get_by_label
**Learning:** Playwright's `get_by_label` will match both the `input` and any element (like a `button`) that uses the exact same string in its `aria-label`, leading to strict mode violations.
**Action:** Use `get_by_role('textbox', name=...)` or distinct text for `aria-label`s versus visible `label`s when writing verification scripts for associated form inputs.
