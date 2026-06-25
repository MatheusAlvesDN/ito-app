## 2026-06-25 - Icon-only buttons lacking ARIA labels
**Learning:** The application uses duplicated components for its different game modes (e.g., `ito`, `impostor`, `whoami`). While `src/ito/RegisterScreen.tsx` includes `aria-label` attributes for its icon-only buttons, the corresponding components in `impostor` and `whoami` do not. This is an accessibility issue for screen readers.
**Action:** Add `aria-label` to icon-only buttons in `src/impostor/RegisterScreen.tsx` and `src/whoami/RegisterScreen.tsx` to match the accessibility standards already present in `src/ito/RegisterScreen.tsx`.
