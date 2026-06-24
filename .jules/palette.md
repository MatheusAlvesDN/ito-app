
## 2024-06-24 - Accessibility consistency across duplicated game modes
**Learning:** The application duplicates UI components (like RegisterScreen) across its multiple game modes. While one mode (`ito`) had partial ARIA labeling implemented, the others (`impostor` and `whoami`) lacked them entirely. Also, all modes were missing explicit form control association (`htmlFor` / `id` on participant text inputs).
**Action:** When auditing or implementing an accessibility enhancement in one game mode, always check the equivalent components in the parallel game modes to ensure consistent UX standards across the entire application.
