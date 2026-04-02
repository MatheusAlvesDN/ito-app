## 2024-06-25 - Descriptive ARIA labels and HTML for forms
**Learning:** For dynamic content rendering lists, static generic ARIA labels (like "Remover" or "Mover para cima") provide insufficient context to screen reader users about *which* element is being acted upon. Further, inputs lacking explicit association via `id` and `htmlFor` are often skipped or misidentified.
**Action:** Always include the specific item name in the ARIA label for dynamic lists (e.g. `aria-label={"Remover ${player}"}`). Consistently use `htmlFor` on labels targeting form inputs with a corresponding `id`.
