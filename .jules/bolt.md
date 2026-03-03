## 2024-05-14 - Initial Setup
**Learning:** Initialized Bolt journal.
**Action:** Ready to track performance learnings.

## 2024-05-15 - React Component Extraction for Input Optimization
**Learning:** In a single-file application structure like `App.tsx`, maintaining rapid-updating state (like text input) at the top level of a screen component (`RegisterScreen`) forces the entire screen, including potentially large lists (like the player list), to re-render on every keystroke. This causes noticeable input lag on slower devices.
**Action:** Always extract text input fields into isolated components (like `AddPlayerInput`) when they share a parent with expensive-to-render sibling components or lists. This restricts the high-frequency state updates (re-renders) strictly to the input component itself.
