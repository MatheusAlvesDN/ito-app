## 2024-05-24 - Input Latency Optimization
**Learning:** Typing in an input field that resides in the same component as a large list causes the entire list to re-render on every keystroke, leading to noticeable input lag.
**Action:** Extract list items into `memo` components and use `useCallback` for event handlers passed to them. This isolates the input state updates from the list rendering.
