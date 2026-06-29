## 2024-05-24 - Consistent Accessibility Across Cloned Components
**Learning:** The application uses duplicated component structures for different game modes (e.g., `RegisterScreen` in `ito`, `whoami`, and `impostor`). Accessibility omissions in one mode are often replicated across all others.
**Action:** When adding UX/a11y improvements to a component in one game mode, always search for and apply the identical fix to the corresponding components in the other game mode directories to maintain a consistent accessibility baseline.
