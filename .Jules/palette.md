# Palette's Journal

This journal tracks critical UX and accessibility learnings.
Only add entries for significant patterns, insights, or design system decisions.

Format:
## YYYY-MM-DD - [Title]
**Learning:** [UX/a11y insight]
**Action:** [How to apply next time]

## 2025-05-24 - Missing ARIA labels on Icon-only buttons
**Learning:** Several icon-only buttons (back, delete, add, arrows) lacked accessible names, making them invisible to screen readers.
**Action:** Always check `aria-label` for buttons that only contain an icon (<Icon />) during development.
