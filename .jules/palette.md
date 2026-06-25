## 2024-05-24 - Accessibility on Icon-Only Action Buttons
**Learning:** React components containing purely visual or iconic representation of their function (e.g., Lucide React icons like `X`, `Trash2`, `Plus` inside `<button>`) must provide readable contexts for screen readers.
**Action:** When creating purely functional UI buttons in these repos without explicit text, always apply `aria-label` tags referencing exactly what action will trigger, strictly localized to Portuguese per the app's standard ('Voltar', 'Remover jogador', 'Adicionar jogador').
