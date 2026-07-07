## 2024-05-18 - Missing ARIA labels in replicated components
**Learning:** In applications where UI components are replicated across different modules (like `RegisterScreen.tsx` for multiple game modes), accessibility features such as `aria-label` for icon-only buttons are often missed in some variations while being present in others.
**Action:** Always check all sibling components when adding accessibility features to one component to ensure consistency across the entire app.
