## 2025-03-09 - Accessible Icon Buttons in Lobby Screens
**Learning:** The application has a consistent pattern of using icon-only buttons (like back buttons, add/remove player, and copy to clipboard) across multiple game modes and lobby screens without `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Applied `aria-label` attributes to these icon buttons. Next time, systematically verify sibling components across `impostor`, `whoami`, and `ito` game modes for similar accessibility omissions when touching UI elements.
