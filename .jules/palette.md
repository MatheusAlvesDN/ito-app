## 2024-03-24 - Dynamic Lists & Icon Actions
**Learning:** Screen readers miss dynamic list additions/removals without `aria-live`, and icon-only actions (like "remove player") need dynamic `aria-label`s to be distinct. Adding `maxLength` to inputs prevents unbounded memory usage.
**Action:** Use `aria-live="polite"` on containers for dynamic lists, bind dynamic `aria-label`s to row actions (e.g., `aria-label={"Remove ${item}"}`), and set `maxLength` on form inputs to prevent excessively long strings.
