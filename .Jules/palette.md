# Palette's Journal

## 2024-05-22 - Dynamic List Accessibility
**Learning:** Icon-only delete buttons in dynamic lists (like player registration) are completely unusable for screen reader users without `aria-label`. The generic "Remove" label is insufficient; it must be context-specific (e.g., "Remove [Name]").
**Action:** Always inspect dynamic list components for interactive elements and ensure they have descriptive, unique accessible names.
