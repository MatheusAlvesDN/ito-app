## 2024-05-19 - Missing ARIA labels on icon-only buttons
**Learning:** Found an icon-only button without an ARIA label in `LobbySetupScreen.tsx`, making it inaccessible to screen reader users. The back button relies purely on the visual `ChevronLeft` icon.
**Action:** Always add descriptive `aria-label` attributes (in Portuguese, for this app) to icon-only buttons to ensure keyboard and screen reader accessibility.
