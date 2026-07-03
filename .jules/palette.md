## 2026-07-03 - Added ARIA labels to icon-only buttons
**Learning:** Adding explicit `aria-label` attributes to icon-only buttons (like back, add, and remove buttons) ensures they are accessible to screen readers, which cannot infer the button's purpose from an icon alone.
**Action:** Always include an `aria-label` describing the action when implementing buttons that only contain an icon (e.g., Lucide React icons) and no visible text.
