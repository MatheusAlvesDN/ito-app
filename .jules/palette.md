## 2024-07-04 - ARIA labels in RegisterScreen
**Learning:** `src/ito/RegisterScreen.tsx` has `aria-label`s for interactive buttons but they are missing in `src/impostor/RegisterScreen.tsx` and `src/whoami/RegisterScreen.tsx`.
**Action:** Ensure sibling components across different game modes have consistent accessibility attributes like `aria-label`.
