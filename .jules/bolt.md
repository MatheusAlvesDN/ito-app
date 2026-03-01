
## 2025-03-01 - Isolate High-Frequency State Updates in React
**Learning:** In React components like `RegisterScreen` that hold high-frequency state updates (like an `inputValue` from an `<input>` field), keeping the state in the parent component causes the entire component and its potentially expensive siblings (like a dynamically rendered list of items) to re-render needlessly on every keystroke. This causes perceivable UI lag on complex screens.
**Action:** Always extract raw input fields and their associated fast-changing state into isolated, single-purpose components (e.g., `<PlayerInput />`). Only bubble the state up to the parent via callback (e.g., `onAdd`) when the user finalizes the input, preventing cascading and expensive sibling re-renders.
