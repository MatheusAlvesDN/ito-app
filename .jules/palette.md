## 2024-03-17 - Missing ARIA Labels on Interactive Elements
**Learning:** Icon-only buttons (like Add Player or Remove Player) and dynamic lists lacking ARIA associations create a significant barrier for screen readers in this application's components.
**Action:** When creating or modifying dynamic form fields and icon-only buttons, always explicitly associate labels with inputs using `htmlFor` and `id`, apply descriptive `aria-label`s to purely visual buttons, and wrap dynamic lists in an `aria-live` region.
