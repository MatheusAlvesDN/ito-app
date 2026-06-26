## 2024-06-26 - React.memo for Drag and Drop Lists
**Learning:** In a highly interactive draggable list (using `@dnd-kit/sortable`), re-ordering elements can cause expensive re-renders across the entire list due to parent state updates.
**Action:** Wrap the individual draggable item component in `React.memo` (and add `.displayName`) to prevent these unnecessary re-renders, significantly improving performance and touch responsiveness during dragging.
