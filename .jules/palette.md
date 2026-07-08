## 2024-03-05 - Added ARIA Labels to Registration Buttons
**Learning:** Found multiple icon-only buttons (like Plus, Trash, X for close) in the `RegisterScreen` components for both Impostor and WhoAmI modes that were missing `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Added explicit, Portuguese `aria-label`s ("Adicionar jogador", "Remover jogador", "Voltar", "Remover do histórico") to all icon-only buttons across these components to ensure keyboard/screen reader accessibility.
