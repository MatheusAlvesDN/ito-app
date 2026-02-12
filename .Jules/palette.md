## 2024-05-23 - Dynamic List Accessibility
**Learning:** When rendering a list of items where each item has an action (like delete), simply labeling the button "Remove" is ambiguous for screen reader users.
**Action:** Always include the item's name in the `aria-label` (e.g., `aria-label={\`Remover ${player}\`}`) to provide context.
