## 2024-07-03 - Missing ARIA Labels on Icon Buttons across Similar Components
**Learning:** This app replicates similar views (like RegisterScreen) across its multiple game modes (ito, impostor, whoami) and connection lobby, yet a11y standards like aria-labels are inconsistently applied. The `ito/RegisterScreen` has them, but `impostor`, `whoami`, and `lobby` components miss them for basic actions like back (`ChevronLeft`) and delete (`Trash2`).
**Action:** Always check all parallel game mode folders when updating a UI component to ensure a11y consistency.
