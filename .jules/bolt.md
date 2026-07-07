## 2024-05-24 - Optimize @dnd-kit/sortable items
**Learning:** Wrapping sortable items with `React.memo` when using `@dnd-kit/sortable` prevents expensive and unnecessary re-renders of the entire list during drag-and-drop operations, which is specifically recommended by the dnd-kit documentation for list performance.
**Action:** Always wrap individual sortable list item components (e.g., `SortablePlayerItem`) in `React.memo()` in performance-sensitive lists.
