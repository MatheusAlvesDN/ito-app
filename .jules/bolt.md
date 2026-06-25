## 2024-06-25 - React.memo for Draggable Lists
**Learning:** Using @dnd-kit/sortable triggers re-renders on the entire list during drag operations if items are not memoized.
**Action:** Always wrap individual draggable list item components (like `SortablePlayerItem`) with `React.memo` and append `displayName` to prevent expensive re-renders and improve drag performance.
