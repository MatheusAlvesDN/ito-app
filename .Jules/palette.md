## 2024-10-26 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** The application heavily relies on `lucide-react` icons for buttons (e.g., `Plus`, `Trash2`, `ChevronLeft`) without text labels. These often lack `aria-label` attributes, making them inaccessible to screen readers.
**Action:** When creating or modifying icon-only buttons, always include a descriptive `aria-label`. For dynamic lists (like players), include the item name in the label (e.g., `aria-label={\`Remover \${player}\`}`).
