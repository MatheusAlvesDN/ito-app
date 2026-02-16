## 2025-02-14 - Accessibility Patterns in List Management
**Learning:** The app frequently uses icon-only buttons (like `Trash2`, `Plus`, `ChevronLeft`) without text labels or `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Always add `aria-label` to icon-only buttons, especially in list item actions (like delete) where context is crucial (e.g., "Remove Alice" instead of just "Remove").

## 2025-02-14 - Form Input Association
**Learning:** Input fields were found with visual labels that were not programmatically associated using `htmlFor` and `id`.
**Action:** Ensure every `<label>` has a corresponding `htmlFor` matching the `id` of the `<input>` it describes to support click-to-focus and screen reader announcements.
