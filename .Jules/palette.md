## 2024-05-21 - Icon-Only Buttons and Accessibility
**Learning:** Icon-only buttons are a common pattern in mobile apps but often lack accessible names, making them invisible to screen reader users.
**Action:** Always add `aria-label` to icon-only buttons, even if the icon seems obvious visually (like a back arrow or trash can). Use dynamic labels (e.g., `Remover ${player}`) for list items to provide context.
