## 2024-06-24 - Add ARIA labels to icon-only buttons
**Learning:** Found an accessibility issue pattern in the app's components where several icon-only buttons (like 'Back', 'Add', and 'Remove') were missing `aria-label` attributes across different game mode screens (Impostor and Quem Sou Eu).
**Action:** When adding new icon-only buttons in future developments or refactors, always associate an explicit `aria-label` using Portuguese terminology to maintain accessibility and consistency across the app.
