## 2025-06-22 - Accessibility in Navigation and Forms
**Learning:** Repetitive setup screens often neglect basic accessibility, like `aria-label`s on icon-only navigation buttons and explicitly linking `<label>` elements to `<input>` fields using `htmlFor`/`id`. These are critical for screen readers.
**Action:** Always verify `aria-label` exists for icon-only buttons (`ChevronLeft`, etc.), and ensure forms properly associate labels and inputs during new screen implementations.
