## 2026-03-02 - [A11y on Dynamic Lists]
**Learning:** Including the actual item name (e.g., `aria-label={\`Remove ${player}\`}`) in icon-only buttons for dynamic lists is critical for screen reader users to understand *which* item they are interacting with. Also, adding `aria-live="polite"` to the container of the dynamic list ensures that additions and removals are announced automatically.
**Action:** Always interpolate item identifiers into `aria-label`s for repeated elements (like delete or move buttons), and use `aria-live` regions for lists that update without a page reload.
