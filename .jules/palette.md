## 2025-02-12 - Missing ARIA Labels on Icon-only Navigation Buttons
**Learning:** Found several top-level navigation components (`App.tsx`, `ConnectionSelectionScreen.tsx`, `LobbySetupScreen.tsx`, etc) that use `ChevronLeft` as an icon-only "back" button but lack `aria-label="Voltar"` attributes. This makes navigation inaccessible to screen readers, especially across game modes (Impostor, Who Am I).
**Action:** Always add `aria-label` to icon-only back buttons across the entire application interface to maintain consistent accessibility.
