## 2026-06-29 - Fixed Missing Labels and ARIA Labels
**Learning:** Common pattern in this application's forms (e.g., `RegisterScreen`, `LobbySetupScreen`) is relying solely on placeholders or unlinked `<label>` tags for inputs, and omitting `aria-label`s on icon-only buttons (`lucide-react` icons).
**Action:** When adding or modifying input elements, always use `htmlFor` and `id` to associate labels. Ensure all icon-only interactive elements receive descriptive `aria-label` attributes in Portuguese (e.g., "Voltar", "Adicionar jogador").
