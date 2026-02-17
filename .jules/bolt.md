## 2024-05-22 - Isolating Input State
**Learning:** Extracting high-frequency state updates (like text inputs) into isolated components prevents expensive re-renders of parent and sibling components. This is a critical pattern for React performance, especially in list-heavy screens.
**Action:** Always check for state lifting that causes unnecessary re-renders. If a state update only affects a small part of the UI, move that state down to a smaller component.
