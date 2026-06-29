## 2025-02-28 - Optimizing draggable lists in React
**Learning:** In React applications using drag-and-drop libraries like `@dnd-kit/sortable`, rendering items in a list without memoization causes all items to re-render during drag interactions, negatively impacting performance.
**Action:** Always wrap individual draggable list item components (e.g., `SortablePlayerItem`) in `React.memo` to prevent unnecessary re-renders of unaffected items during drag events. When wrapping anonymous functions, explicitly add `displayName` to prevent ESLint warnings and aid debugging.
