## 2026-07-04 - Optimize Draggable Lists
**Learning:** Draggable lists without memoization can cause expensive re-renders of the entire list during drag-and-drop interactions.
**Action:** Wrap individual list item components in React.memo when using @dnd-kit/sortable.
