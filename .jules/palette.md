## 2025-06-26 - Inconsistent Aria Labels Across Component Variants
**Learning:** The app duplicates similar UI components (like `RegisterScreen`) across different game modes (`ito`, `impostor`, `whoami`). While the base `ito` mode had `aria-label` attributes for icon-only buttons, they were completely omitted when these components were duplicated to other modes.
**Action:** When adding accessibility attributes to a component, explicitly check if the same component structure is duplicated in other game mode directories, and ensure they are all updated consistently.
