## 2025-02-18 - Prevent Draggable Item Re-renders
**Learning:** In dragging libraries like `@dnd-kit/sortable`, rendering an entire list of draggable items without memoization causes massive unnecessary re-renders of the un-dragged items during every drag interaction tick.
**Action:** Always wrap individual list item components with `React.memo()` in draggable lists to ensure only the actively dragged item (and its positional swaps) re-renders, vastly improving performance in ordering phases.
