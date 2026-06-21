## $(date +%Y-%m-%d) - Adding ARIA labels to back buttons
**Learning:** Found multiple icon-only "back" buttons across components missing ARIA labels, creating accessibility barriers for screen readers. The app consistently uses `<button onClick={onBack}><ChevronLeft /></button>`.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes (e.g., `aria-label="Voltar"`) to improve screen reader accessibility.
